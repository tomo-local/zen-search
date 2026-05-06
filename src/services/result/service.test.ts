import { describe, expect, it, vi } from "vitest";
import type { ResultServiceDependencies } from "./service";
import { createResultService } from "./service";

const makeDeps = (
  overrides: Partial<ResultServiceDependencies> = {},
): ResultServiceDependencies => ({
  tabService: { query: vi.fn().mockResolvedValue([]) },
  bookmarkService: {
    query: vi.fn().mockResolvedValue([]),
    getRecent: vi.fn().mockResolvedValue([]),
  },
  historyService: { query: vi.fn().mockResolvedValue([]) },
  suggestionService: { multiEngineQuery: vi.fn().mockResolvedValue([]) },
  actionService: {
    isCalculation: vi.fn().mockReturnValue(false),
    calculate: vi.fn(),
  },
  storageService: { getSearchEngines: vi.fn().mockResolvedValue(["google"]) },
  ...overrides,
});

describe("createResultService", () => {
  it("calls tabService.query when Tab category is requested", async () => {
    const mockTabService = { query: vi.fn().mockResolvedValue([]) };
    const service = createResultService(
      makeDeps({ tabService: mockTabService }),
    );

    await service.query({
      filters: { query: "test", count: 10, categories: ["Tab"] },
    });

    expect(mockTabService.query).toHaveBeenCalledOnce();
  });

  it("calls bookmarkService.query when Bookmark category is requested with a query", async () => {
    const mockBookmarkService = {
      query: vi.fn().mockResolvedValue([]),
      getRecent: vi.fn().mockResolvedValue([]),
    };
    const service = createResultService(
      makeDeps({ bookmarkService: mockBookmarkService }),
    );

    await service.query({
      filters: { query: "test", count: 10, categories: ["Bookmark"] },
    });

    expect(mockBookmarkService.query).toHaveBeenCalledOnce();
    expect(mockBookmarkService.getRecent).not.toHaveBeenCalled();
  });

  it("calls bookmarkService.getRecent when Bookmark category is requested without a query", async () => {
    const mockBookmarkService = {
      query: vi.fn().mockResolvedValue([]),
      getRecent: vi.fn().mockResolvedValue([]),
    };
    const service = createResultService(
      makeDeps({ bookmarkService: mockBookmarkService }),
    );

    await service.query({ filters: { count: 10, categories: ["Bookmark"] } });

    expect(mockBookmarkService.getRecent).toHaveBeenCalledOnce();
    expect(mockBookmarkService.query).not.toHaveBeenCalled();
  });

  it("calls historyService.query when History category is requested", async () => {
    const mockHistoryService = { query: vi.fn().mockResolvedValue([]) };
    const service = createResultService(
      makeDeps({ historyService: mockHistoryService }),
    );

    await service.query({
      filters: { query: "test", count: 10, categories: ["History"] },
    });

    expect(mockHistoryService.query).toHaveBeenCalledOnce();
  });

  it("does not call tabService when Tab is not in categories", async () => {
    const mockTabService = { query: vi.fn().mockResolvedValue([]) };
    const service = createResultService(
      makeDeps({ tabService: mockTabService }),
    );

    await service.query({
      filters: { query: "test", count: 10, categories: ["History"] },
    });

    expect(mockTabService.query).not.toHaveBeenCalled();
  });

  it("prepends Action.Calculation results at head when expression matches", async () => {
    // TODO(human): implement this test case
    // The Action.Calculation result should appear before other results.
    // Hint: use mockReturnValue(true) for isCalculation and return a fake action from calculate.
    // Check that the returned array starts with the action result.
  });

  it("queries all categories in parallel when multiple categories provided", async () => {
    const deps = makeDeps();
    const service = createResultService(deps);

    await service.query({
      filters: {
        query: "test",
        count: 20,
        categories: ["Tab", "Bookmark", "History"],
      },
    });

    expect(deps.tabService.query).toHaveBeenCalledOnce();
    expect(deps.bookmarkService.query).toHaveBeenCalledOnce();
    expect(deps.historyService.query).toHaveBeenCalledOnce();
  });
});
