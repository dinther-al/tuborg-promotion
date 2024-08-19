import React from "react";
import axios from "axios";

const CodeGiftAPI = {
    async getCodeGift() {
        try {
            const response = await axios.get(
                "https://api.jsonbin.io/v3/b/66582bf4acd3cb34a84feaf0"
            );
            if (response?.data?.record) {
                return response.data.record.giftCodes;
            }
        } catch (error) {
            return error;
        }
    },
};

const GiftAPI = {
    async getGift() {
        try {
            const response = await axios.get(
                "https://api.jsonbin.io/v3/b/66582bf4acd3cb34a84feaf0"
            );
            if (response?.data?.record) {
                return response.data.record.gifts;
            }
        } catch (error) {
            return error;
        }
    },
};

export { CodeGiftAPI, GiftAPI };
