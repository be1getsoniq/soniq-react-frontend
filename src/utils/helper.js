export function getBaseUrl() {
    let base_url = import.meta.env.VITE_dev_base_url;
    console.log(" BASE URL SET TO : ", base_url);
    if (import.meta.env.VITE_enviornment === "prod") {
      base_url = import.meta.env.VITE_prod_base_url;
      console.log(" updated BASE URL SET TO : ", base_url);
    }
    return base_url;
}