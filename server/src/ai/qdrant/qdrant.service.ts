import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from 'axios';

@Injectable()
export class QdrantService {
  private qdrantUrl : string;
  private collectionName : string;

  constructor(
    private readonly configService : ConfigService,
  ){
    this.collectionName = this.configService.get<string>('QDRANT_COLLECTION_NAME') as string;
    this.qdrantUrl = this.configService.get<string>('QDRANT_URL') as string;
  }

  private async searchSimilarExpression(vector: number[], threshold = 0.95, topK = 5): Promise<any[]> {
    try{
      const res = await axios.post(`${this.qdrantUrl}/collections/${this.collectionName}/points/search`, {
        vector,
        top: topK,
        score_threshold: threshold,
      });
      return res.data.result;
  
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  private async upserExpressionVector(id: string, vector: number[], payload: Record<string, any>): Promise<void> {
    try {
      await axios.put(`${this.qdrantUrl}/collections/${this.collectionName}/points`, {
        points: [
          {
            id,
            vector,
            payload,
          },
        ],
      });
    } catch (error) {
      console.error(error);
    }
  }

  private async createCollectionIfNotExists(): Promise<void> {
    try {
      const res = await axios.get(`${this.qdrantUrl}/collections`);
      const exists = res.data.result?.some((col: any) => col.name === this.collectionName);
      if (!exists) {
        await axios.put(`${this.qdrantUrl}/collections/${this.collectionName}`, {
          vectors: {
            size: 1536,
            distance: 'Cosine'
          }
        });
        console.log(`[Qdrant] 컬렉션 '${this.collectionName}' 생성 완료 ✅`);
      }  
    } catch (error) {
      console.error(error);
    }
  }

  async deleteVector(id: string): Promise<void> {
    try {
      await axios.post(`${this.qdrantUrl}/collections/${this.collectionName}/points/delete`, {
        points: [id]
      });
    } catch (error) {
      console.error(error)
    }
  }
}