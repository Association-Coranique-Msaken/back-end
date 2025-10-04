const uri = "https://literate-engine-jp5q4gv4wwpcj6rv-5000.app.github.dev/api/v1/";
export const admin_auth = uri + "auth/admin/login";

export const uri_auth = (role) => {
    return uri + "auth/" + role + "/login";
};
