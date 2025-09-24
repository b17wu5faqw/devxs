import { getUrl } from "./auth";
import { get, post } from "./request";

export const getCurrentDraw = async (scheduler_id: number): Promise<any> => {
    const resp = await get(getUrl(`ku/get-draw?scheduler_id=${scheduler_id}`));
    return resp.data;
};