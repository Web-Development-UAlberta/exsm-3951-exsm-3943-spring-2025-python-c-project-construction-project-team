import { IPublicClientApplication } from "@azure/msal-browser";
import { useQuery} from "@tanstack/react-query";
import { fetchGraphMe } from "./graphQueries";

const QUERY_KEY = "identity";

export function getActiveUserInfo(msalInstance: IPublicClientApplication) {
    const query = useQuery({
        queryKey: [QUERY_KEY, "me"],
        queryFn: () => fetchGraphMe(msalInstance),
    });
    return query;
}