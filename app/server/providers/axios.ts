import axiosx from "axios";

const getDefaultAxios = () => {
    return axiosx.create({
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
};

export const axios = getDefaultAxios();