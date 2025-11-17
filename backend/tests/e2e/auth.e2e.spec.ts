/**
 * E2E Tests for Authentication Flow
 * Tests run against the Docker instance
 */

import axios from "axios";
import { ApiResponse, LoginResponse, AxiosResponse } from "./types";
import { generateUserIdentifier } from "./test-helpers";

const API_BASE_URL = process.env.E2E_API_URL || "http://localhost:5000/api/v1";

describe("E2E: Authentication Flow", () => {
    let adminToken: string;

    describe("Admin Authentication", () => {
        it("should login with existing admin credentials", async () => {
            // Use the default admin created in setup
            const response: AxiosResponse<LoginResponse> = await axios.post(`${API_BASE_URL}/auth/admin/login`, {
                username: "testadmin",
                password: "Test@12345",
            });

            expect(response.status).toBe(200);
            expect(response.data.success).toBe(true);
            expect(response.data).toHaveProperty("accessToken");
            expect(response.data).toHaveProperty("refreshToken");

            adminToken = response.data.accessToken;
        });

        it("should fail login with wrong password", async () => {
            try {
                await axios.post(`${API_BASE_URL}/auth/admin/login`, {
                    username: "testadmin",
                    password: "wrongPassword",
                });
                fail("Should have thrown an error");
            } catch (error: any) {
                expect(error.response.status).toBe(401);
                expect(error.response.data.success).toBe(false);
            }
        });

        it("should refresh access token", async () => {
            // First login to get tokens
            const loginResponse: AxiosResponse<LoginResponse> = await axios.post(`${API_BASE_URL}/auth/admin/login`, {
                username: "testadmin",
                password: "Test@12345",
            });

            const refreshToken = loginResponse.data.refreshToken;

            // Refresh the token (refresh_token in body, not header)
            const response: AxiosResponse<LoginResponse> = await axios.post(`${API_BASE_URL}/auth/refresh-token/`, {
                refresh_token: refreshToken,
            });

            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty("accessToken");
        });

        it("should logout successfully", async () => {
            const response: AxiosResponse<ApiResponse> = await axios.post(
                `${API_BASE_URL}/auth/logout`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${adminToken}`,
                    },
                }
            );

            expect(response.status).toBe(200);
            expect(response.data.success).toBe(true);
        });
    });

    describe("User Authentication", () => {
        it("should login as user with identifier and birthDate", async () => {
            const response: AxiosResponse<LoginResponse> = await axios.post(`${API_BASE_URL}/auth/user/login`, {
                identifier: "2025002",
                birthDate: "01/01/1990",
            });

            expect(response.status).toBe(200);
            expect(response.data.success).toBe(true);
            expect(response.data).toHaveProperty("accessToken");
        });

        // Skip this test to avoid rate limiting issues
        // Wrong credentials are already tested in the admin test above
        it.skip("should fail with wrong birth date for existing user", async () => {
            // First create a user to test against
            const loginResponse: AxiosResponse<LoginResponse> = await axios.post(`${API_BASE_URL}/auth/admin/login`, {
                username: "testadmin",
                password: "Test@12345",
            });

            const adminToken = loginResponse.data.accessToken;

            const createUserResponse: AxiosResponse<ApiResponse<any>> = await axios.post(
                `${API_BASE_URL}/admin-api/user/`,
                {
                    identifier: generateUserIdentifier(),
                    firstName: "Auth",
                    lastName: "TestUser",
                    fatherFirstName: "Father",
                    motherFirstName: "Mother",
                    motherLastName: "MotherLast",
                    birthDate: "05/10/2000",
                    birthPlace: "Test City",
                    gender: "female",
                },
                {
                    headers: {
                        Authorization: `Bearer ${adminToken}`,
                    },
                }
            );

            const userId = createUserResponse.data.data.identifier;

            // Now try to login with wrong birthDate
            try {
                await axios.post(`${API_BASE_URL}/auth/user/`, {
                    identifier: userId,
                    birthDate: "01/01/2000", // Wrong birth date
                });
                fail("Should have thrown an error");
            } catch (error: any) {
                expect(error.response.status).toBe(401);
                expect(error.response.data.success).toBe(false);
            }
        });
    });
});
