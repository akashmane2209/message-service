import { UNPROCESSABLE_ENTITY } from "stoker/http-status-codes";
const defaultHook = (result, c) => {
    if (!result.success) {
        return c.json({
            success: result.success,
            error: result.error,
        }, UNPROCESSABLE_ENTITY);
    }
};
export default defaultHook;