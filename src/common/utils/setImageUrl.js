import { getUser } from "thoughtware-core-ui";

const tenant = getUser(). tenant;

const setImageUrl = (url) => {
    const imageUrl = version === "cloud" ? 
        (upload_url + url + "?tenant=" + tenant)
        :
        (upload_url + url);
    return imageUrl;
} 

export default setImageUrl;