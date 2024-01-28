import { Injectable } from "@nestjs/common";
import axios from "axios";


@Injectable()
export class HttpsService {
    async getAllComments(
        id: string,
        page?: number
    ) : Promise<Comment[]> {
        const res = await axios.get(`http://comment:3030/${id}/comment`, { params: { page: page } });
        return res.data;
    }
}