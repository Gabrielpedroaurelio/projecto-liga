function buildHeaders(isJson = true) {
    const token = localStorage.getItem("token");

    const base = isJson
        ? { "Content-Type": "application/json" }
        : {};

    if (token) {
        return {
            ...base,
            Authorization: `Bearer ${token}`,
        };
    }

    return base;
}

export async function PostRequest(url, content) {
    const options = {
        method: "POST",
        headers: buildHeaders(true),
        body: JSON.stringify(content),
    };

    const response = await fetch(url, options);

    if (!response.ok) {
        console.log(`Failed Request ... \n Error: ${response.statusText}`);
        return null;
    }
    return await response.json();
}

export async function GetRequest(url) {
    const options = {
        method: "GET",
        headers: buildHeaders(false),
    };

    const resquest = await fetch(url, options);
    if (!resquest.ok) {
        console.log(`Falied Request ... \n Error: ${resquest.statusText}`);
        return null;
    }

    const returns_request = await resquest.json();
    return returns_request;
}

export async function PuteRequest(url, content) {
    const options = {
        method: "PUT",
        headers: buildHeaders(true),
        body: JSON.stringify(content),
    };

    const resquest = await fetch(url, options);
    if (!resquest.ok) {
        console.log(`Falied Request ... \n Error: ${resquest.statusText}`);
        return null;
    }

    const returns_request = await resquest.json();
    return returns_request;
}

export async function DeleteRequest(url) {
    const options = {
        method: "DELETE",
        headers: buildHeaders(false),
    };

    const resquest = await fetch(url, options);
    if (!resquest.ok) {
        console.log(`Falied Request ... \n Error: ${resquest.statusText}`);
        return null;
    }

    const returns_request = await resquest.json();
    return returns_request;
}