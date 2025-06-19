import { HttpService } from "@nestjs/axios";
import { Inject, Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { QdrantPort } from "src/ai/port/out/qdrant.port";
import { ExpressionPort } from "src/expression/port/expression.port";
import { OpenaiAdapter } from "./openai.adapter";

@Injectable()
export class QdrantAdapter implements QdrantPort {
  private readonly COLLECTION = 'expressions';

  constructor(
    private readonly httpService: HttpService,
    private readonly openaiAdapter: OpenaiAdapter,
    @Inject('ExpressionPort')
  private readonly expressionPort: ExpressionPort,
  ) {}

  async insertEmbedding(id: number, text: string): Promise<void> {
    const vector = await this.openaiAdapter.getEmbedding(text);
    if (!vector?.length) return;

    const payload = {
      points: [
        {
          id,
          vector,
          payload: { id },
        },
      ],
    };

    await firstValueFrom(
      this.httpService.put(
        `http://qdrant:6333/collections/${this.COLLECTION}/points`,
        payload,
      )
    );
  }

  async searchSimilar(text: string): Promise<number> {
    const vector = await this.openaiAdapter.getEmbedding(text);
    if (!vector?.length) return 0;

    const payload = {
      vector,
      limit: 1,
      with_payload: false,
    };

    const res = await firstValueFrom(
      this.httpService.post(
        `http://qdrant:6333/collections/${this.COLLECTION}/points/search`,
        payload,
      )
    );

    return res.data.result?.[0]?.score ?? 0;
  }

  async deleteAllPoints(): Promise<void> {
    const payload = { filter: { must: [] } };

    await firstValueFrom(
      this.httpService.post(
        `http://qdrant:6333/collections/${this.COLLECTION}/points/delete`,
        payload
      )
    );

    console.log(`Qdrant 컬렉션 전체 삭제 완료`);
  }

  async syncAllExpressionsToQdrant(): Promise<void> {
    const expressions = await this.expressionPort.findAll();

    for (const exp of expressions) {
      await this.insertEmbedding(exp.e_id, exp.expression);
    }

    console.log(`Qdrant 전체 동기화 완료`);
  }
}
