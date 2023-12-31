import { accessToken } from "../../tokenAccess.js";

class AxiosUtils {

    config = {
        headers: { Authorization: `Bearer ${accessToken}` }
    };

}

// new AxiosUtils();
export default AxiosUtils;