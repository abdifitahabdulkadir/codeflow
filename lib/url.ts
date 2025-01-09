interface UpdateUrlProps {
  key: string;
  value: string;
}
interface DeleteUrlProps {
  keysToRemove: string[];
}
// adding or updating query params
export const updateUrlQueryParams = ({ value, key }: UpdateUrlProps) => {
  // extrract params from url;
  const queryParams = new URLSearchParams(new URL(window.location.href).search);

  if (value) {
    queryParams.set(key, value);
  } else {
    queryParams.delete(key);
  }
  return `${window.location.pathname}?${queryParams.toString()}`;
};

// removing query params
export const removeUrlQueryParams = ({ keysToRemove }: DeleteUrlProps) => {
  // extrract params from url;
  const queryParams = new URLSearchParams(new URL(window.location.href).search);
  keysToRemove.forEach((key) => queryParams.delete(key));
  return `${window.location.pathname}?${queryParams.toString()}`;
};
