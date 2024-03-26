import { AdminService } from "../../src/services/adminService";

test("No previous user result in a new counting from current year", () => {
    expect(AdminService.computeNextIdentifier(2024, undefined)).toBe("2024001");
    expect(AdminService.computeNextIdentifier(2025, undefined)).toBe("2025001");
});

test("A newer year result in a new counter", () => {
    expect(AdminService.computeNextIdentifier(2024, "2023001")).toBe("2024001");
    expect(AdminService.computeNextIdentifier(2024, "2021600")).toBe("2024001");
    expect(AdminService.computeNextIdentifier(2024, "2023999")).toBe("2024001");
});

test("If we overpassed a year we continue counting the next year", () => {
    expect(AdminService.computeNextIdentifier(2023, "2023999")).toBe("2024000");
    expect(AdminService.computeNextIdentifier(2023, "2024001")).toBe("2024002");
    expect(AdminService.computeNextIdentifier(2023, "2026000")).toBe("2026001");
    expect(AdminService.computeNextIdentifier(2023, "2026999")).toBe("2027000");
});

test("Same year results in incrementing the counter", () => {
    expect(AdminService.computeNextIdentifier(2023, "2023001")).toBe("2023002");
    expect(AdminService.computeNextIdentifier(2023, "2023005")).toBe("2023006");
    expect(AdminService.computeNextIdentifier(2023, "2023998")).toBe("2023999");
});
