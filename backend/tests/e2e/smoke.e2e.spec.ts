/**
 * E2E Smoke Tests
 * Quick smoke tests that validate key workflows without hitting rate limits
 */

import axios from "axios";
import { ApiResponse, LoginResponse, AxiosResponse } from "./types";
import { generateUserIdentifier } from "./test-helpers";

const API_BASE_URL = process.env.E2E_API_URL || "http://localhost:5000/api/v1";

describe("E2E: Smoke Tests", () => {
    let adminToken: string;
    let userId: string;

    it("should complete admin login workflow", async () => {
        const response: AxiosResponse<LoginResponse> = await axios.post(`${API_BASE_URL}/auth/admin/login`, {
            username: "testadmin",
            password: "Test@12345",
        });

        expect(response.status).toBe(200);
        expect(response.data.success).toBe(true);
        expect(response.data).toHaveProperty("accessToken");

        adminToken = response.data.accessToken;
    });

    it("should create a user via admin API", async () => {
        const response: AxiosResponse<ApiResponse<{ id: number }>> = await axios.post(
            `${API_BASE_URL}/admin-api/user/`,
            {
                identifier: generateUserIdentifier(),
                firstName: "E2ETest",
                lastName: "User",
                fatherFirstName: "Father",
                motherFirstName: "Mother",
                motherLastName: "MotherLast",
                birthDate: "01/15/2000",
                birthPlace: "Test City",
                gender: "male",
            },
            {
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                },
            }
        );

        expect(response.status).toBe(201);
        expect(response.data.success).toBe(true);
        expect(response.data.data).toHaveProperty("id");

        userId = response.data.data!.id.toString();
    });

    it("should retrieve created user", async () => {
        const response: AxiosResponse<ApiResponse<any>> = await axios.get(`${API_BASE_URL}/admin-api/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${adminToken}`,
            },
        });

        expect(response.status).toBe(200);
        expect(response.data.success).toBe(true);
        expect(response.data.data!.firstName).toBe("E2ETest");
    });

    it("should update user information", async () => {
        const response: AxiosResponse<ApiResponse<any>> = await axios.patch(
            `${API_BASE_URL}/admin-api/user/${userId}`,
            {
                firstName: "UpdatedE2E",
            },
            {
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                },
            }
        );

        expect(response.status).toBe(201);
        expect(response.data.success).toBe(true);
    });

    it("should delete created user", async () => {
        const response: AxiosResponse<ApiResponse> = await axios.delete(`${API_BASE_URL}/admin-api/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${adminToken}`,
            },
        });

        expect(response.status).toBe(200);
        expect(response.data.success).toBe(true);
    });

    it("should reject unauthorized requests", async () => {
        try {
            await axios.get(`${API_BASE_URL}/admin-api/user/list`);
            fail("Should have thrown an error");
        } catch (error: any) {
            expect(error.response.status).toBe(401);
        }
    });
});
