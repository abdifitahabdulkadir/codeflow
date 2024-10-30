import qs from "query-string";
interface UpdateUrlProps {
  params: string;
  key: string;
  value: string;
}

interface DeleteUrlProps {
  params: string;
  keysToRemove: string[];
}
export const updateUrlQueryParams = ({
  params,
  value,
  key,
}: UpdateUrlProps) => {
  // parse the previous queryString we had --remove spaces and plus signs
  const queryString = qs.parse(params);

  // update the query string with the new value
  queryString[key] = value;

  // stringify object into url and append the
  // query string and return the new url
  return qs.stringifyUrl({
    url: window.location.pathname,
    query: queryString,
  });
};

export const removeUrlQueryParams = ({
  params,
  keysToRemove,
}: DeleteUrlProps) => {
  // parse the previous queryString we had --remove spaces and plus signs
  const queryString = qs.parse(params);

  // remove the key from the query string
  keysToRemove.forEach((key) => delete queryString[key]);

  // stringify object into url and append the
  // query string and return the new url
  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: queryString,
    },
    { skipNull: true },
  );
};
