import { Injectable } from "@nestjs/common";
import axios from "axios";


@Injectable()
export class HttpsService {
    async getAllComments(
        id: string,
        page?: number
    ) : Promise<Comment[]> {
        const res = await axios.get(`http://comment/${id}/comment`, { params: { page: page } });
        return res.data;
    }
}