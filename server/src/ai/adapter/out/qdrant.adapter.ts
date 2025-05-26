import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { QdrantPort } from "src/ai/port/out/qdrant.port";
import { AiService } from "src/ai/service/ai.service";

@Injectable()
export class QdrantAdapter implements QdrantPort {
  private readonly COLLECTION = 'expressions';

  constructor(
    private readonly httpService: HttpService, 
    private readonly aiService: AiService
  ) {}

  async searchSimilar(text: string): Promise<number> {
    const vector = await this.aiService.getEmbedding(text);
    const payload = {
      vector,
      limit: 1,
      with_payload: false,
    };

    const res = await firstValueFrom(
      this.httpService.post(
        `http://localhost:6333/collections/${this.COLLECTION}/points/search`,
        payload
      )
    );

    return res.data.result?.[0]?.score ?? 0;
  }

  async insertEmbedding(id: number, text: string): Promise<void> {
    const vector = await this.aiService.getEmbedding(text);
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
        `http://localhost:6333/collections/${this.COLLECTION}/points`,
        payload
      )
    );
  }
}
