/**
 * E2E Tests for Admin API - CRUD Operations
 * Tests admin management, user management, teacher management, groups, etc.
 */

import axios from "axios";
import { ApiResponse, User, Teacher, Group, LoginResponse, AxiosResponse } from "./types";
import { generateUserIdentifier, generateGroupCode } from "./test-helpers";

const API_BASE_URL = process.env.E2E_API_URL || "http://localhost:5000/api/v1";

describe("E2E: Admin API CRUD Operations", () => {
    let api: ReturnType<typeof axios.create>;
    let adminToken: string;
    let createdUserId: string;
    let createdTeacherId: string;
    let createdGroupId: string;

    beforeAll(async () => {
        // Login as admin
        const loginResponse: AxiosResponse<LoginResponse> = await axios.post(`${API_BASE_URL}/auth/admin/login`, {
            username: "testadmin",
            password: "Test@12345",
        });

        adminToken = loginResponse.data.accessToken;

        // Create axios instance with auth
        api = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                Authorization: `Bearer ${adminToken}`,
            },
        });
    });

    describe("User Management", () => {
        beforeAll(async () => {
            // Refresh token for this test suite
            const loginResponse: AxiosResponse<LoginResponse> = await axios.post(`${API_BASE_URL}/auth/admin/login`, {
                username: "testadmin",
                password: "Test@12345",
            });
            adminToken = loginResponse.data.accessToken;
            api.defaults.headers.common["Authorization"] = `Bearer ${adminToken}`;
        });

        it("should create a new user", async () => {
            const response: AxiosResponse<ApiResponse<User>> = await api.post("/admin-api/user/", {
                identifier: generateUserIdentifier(),
                firstName: "E2E",
                lastName: "TestUser",
                fatherFirstName: "Father",
                motherFirstName: "Mother",
                motherLastName: "MotherLast",
                birthDate: "05/15/2000",
                birthPlace: "Test City",
                gender: "male",
            });

            expect(response.status).toBe(201);
            expect(response.data.success).toBe(true);
            expect(response.data.data).toHaveProperty("id");

            createdUserId = response.data.data!.id.toString();
        });

        it("should list all users with pagination", async () => {
            const response: AxiosResponse<ApiResponse<User[]>> = await api.get("/admin-api/user/list", {
                params: {
                    page: 1,
                    pageSize: 10,
                },
            });

            expect(response.status).toBe(200);
            expect(response.data.success).toBe(true);
            expect(response.data.data).toBeInstanceOf(Array);
            expect(response.data.meta).toHaveProperty("pageNumber");
            expect(response.data.meta).toHaveProperty("itemCount");
        });

        it("should get user by ID", async () => {
            const response: AxiosResponse<ApiResponse<User>> = await api.get(`/admin-api/user/${createdUserId}`);

            expect(response.status).toBe(200);
            expect(response.data.success).toBe(true);
            expect(response.data.data!.id.toString()).toBe(createdUserId);
            expect(response.data.data!.firstName).toBe("E2E");
        });

        it("should update user information", async () => {
            const response: AxiosResponse<ApiResponse<User>> = await api.patch(`/admin-api/user/${createdUserId}`, {
                firstName: "Updated",
                lastName: "TestUser",
            });

            expect(response.status).toBe(201);
            expect(response.data.success).toBe(true);
        });

        it("should delete user", async () => {
            const response: AxiosResponse<ApiResponse> = await api.delete(`/admin-api/user/${createdUserId}`);

            expect(response.status).toBe(200);
            expect(response.data.success).toBe(true);
        });

        it("should not find deleted user", async () => {
            try {
                await api.get(`/admin-api/user/${createdUserId}`);
                fail("Should have thrown an error");
            } catch (error: any) {
                expect(error.response.status).toBe(404);
            }
        });
    });

    describe("Teacher Management", () => {
        it("should create a new teacher", async () => {
            // First create a user for the teacher
            const userResponse: AxiosResponse<ApiResponse<User>> = await api.post("/admin-api/user/", {
                identifier: generateUserIdentifier(),
                firstName: "E2E",
                lastName: "Teacher",
                fatherFirstName: "Father",
                motherFirstName: "Mother",
                motherLastName: "MotherLast",
                birthDate: "03/20/1985",
                birthPlace: "Test City",
                gender: "female",
            });

            const teacherUserId = userResponse.data.data!.id;

            // Now create the teacher with userId and codeType
            const response: AxiosResponse<ApiResponse<Teacher>> = await api.post("/admin-api/teacher/", {
                userId: teacherUserId,
                codeType: "1",
                kotebName: "Test Koteb",
            });

            expect(response.status).toBe(201);
            expect(response.data.success).toBe(true);
            expect(response.data.data).toHaveProperty("id");
            expect(response.data.data).toHaveProperty("code");

            createdTeacherId = response.data.data!.id.toString();
        });

        it("should list all teachers", async () => {
            const response: AxiosResponse<ApiResponse<Teacher[]>> = await api.get("/admin-api/teacher/list");

            expect(response.status).toBe(200);
            expect(response.data.success).toBe(true);
            expect(response.data.data).toBeInstanceOf(Array);
        });

        it("should get teacher by ID", async () => {
            const response: AxiosResponse<ApiResponse<Teacher>> = await api.get(
                `/admin-api/teacher/${createdTeacherId}`
            );

            expect(response.status).toBe(200);
            expect(response.data.data!.id.toString()).toBe(createdTeacherId);
        });

        it("should update teacher information", async () => {
            const response: AxiosResponse<ApiResponse<Teacher>> = await api.patch(
                `/admin-api/teacher/${createdTeacherId}`,
                {
                    firstName: "UpdatedTeacher",
                }
            );

            expect(response.status).toBe(201);
            expect(response.data.success).toBe(true);
        });

        it("should regenerate teacher password", async () => {
            const response: AxiosResponse<ApiResponse<{ password: string }>> = await api.post(
                `/admin-api/teacher/password/${createdTeacherId}`
            );

            expect(response.status).toBe(201);
            expect(response.data.success).toBe(true);
            expect(response.data.data).toHaveProperty("password");
        });

        it("should delete teacher", async () => {
            const response: AxiosResponse<ApiResponse> = await api.delete(`/admin-api/teacher/${createdTeacherId}`);

            expect(response.status).toBe(200);
            expect(response.data.success).toBe(true);
        });
    });

    describe("Group Management", () => {
        let groupTeacherId: string;

        it("should create a teacher for group tests", async () => {
            // Create user for group's teacher
            const userResponse: AxiosResponse<ApiResponse<User>> = await api.post("/admin-api/user/", {
                identifier: generateUserIdentifier(),
                firstName: "Group",
                lastName: "Teacher",
                fatherFirstName: "Father",
                motherFirstName: "Mother",
                motherLastName: "MotherLast",
                birthDate: "05/15/1988",
                birthPlace: "Test City",
                gender: "male",
            });

            // Create teacher
            const teacherResponse: AxiosResponse<ApiResponse<Teacher>> = await api.post("/admin-api/teacher/", {
                userId: userResponse.data.data!.id,
                codeType: "2",
            });

            groupTeacherId = teacherResponse.data.data!.id.toString();
        });

        it("should create a new group", async () => {
            const response: AxiosResponse<ApiResponse<Group>> = await api.post("/admin-api/group/", {
                code: generateGroupCode(),
                days: "Monday, Wednesday",
                timeRange: "09:00-11:00",
                roomNumber: 101,
                levelOrNumHizbs: "Level 1",
                courseType: "theoretical",
                maxStudents: 30,
                teacherId: groupTeacherId,
            });

            expect(response.status).toBe(201);
            expect(response.data.success).toBe(true);
            expect(response.data.data).toHaveProperty("id");

            createdGroupId = response.data.data!.id.toString();
        });

        it("should list all groups", async () => {
            const response: AxiosResponse<ApiResponse<Group[]>> = await api.get("/admin-api/group/list");

            expect(response.status).toBe(200);
            expect(response.data.data).toBeInstanceOf(Array);
        });

        it("should get group by ID", async () => {
            const response: AxiosResponse<ApiResponse<Group>> = await api.get(`/admin-api/group/${createdGroupId}`);

            expect(response.status).toBe(200);
            expect(response.data.data!.id.toString()).toBe(createdGroupId);
        });

        it("should update group", async () => {
            const response: AxiosResponse<ApiResponse<Group>> = await api.patch(`/admin-api/group/${createdGroupId}`, {
                name: "Updated Group Name",
            });

            expect(response.status).toBe(201);
            expect(response.data.success).toBe(true);
        });

        it("should delete group", async () => {
            const response: AxiosResponse<ApiResponse> = await api.delete(`/admin-api/group/${createdGroupId}`);

            expect(response.status).toBe(200);
            expect(response.data.success).toBe(true);
        });
    });

    describe("Admin Management", () => {
        it("should list all admins", async () => {
            const response: AxiosResponse<ApiResponse<any[]>> = await api.get("/admin-api/admin/list");

            expect(response.status).toBe(200);
            expect(response.data.data).toBeInstanceOf(Array);
            expect(response.data.data!.length).toBeGreaterThan(0);
        });

        it("should get admin by ID", async () => {
            // Get the first admin
            const listResponse: AxiosResponse<ApiResponse<any[]>> = await api.get("/admin-api/admin/list");
            const firstAdminId = listResponse.data.data![0].id;

            const response: AxiosResponse<ApiResponse<any>> = await api.get(`/admin-api/admin/${firstAdminId}`);

            expect(response.status).toBe(200);
            expect(response.data.data!.id).toBe(firstAdminId);
        });
    });

    describe("Authorization Tests", () => {
        it("should reject request without token", async () => {
            try {
                await axios.get(`${API_BASE_URL}/admin-api/admin/list`);
                fail("Should have thrown an error");
            } catch (error: any) {
                expect(error.response.status).toBe(401);
            }
        });

        it("should reject request with invalid token", async () => {
            try {
                await axios.get(`${API_BASE_URL}/admin-api/admin/list`, {
                    headers: {
                        Authorization: "Bearer invalid_token",
                    },
                });
                fail("Should have thrown an error");
            } catch (error: any) {
                expect(error.response.status).toBe(401);
            }
        });
    });
});
