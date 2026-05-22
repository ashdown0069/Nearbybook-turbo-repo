import "reflect-metadata";
import { validate } from "class-validator";
import { SearchEbooksDto } from "./search-ebooks.dto";

describe("SearchEbooksDto", () => {
  it("유효하지 않은 모드일 경우 유효성 검사에 실패해야 한다", async () => {
    const dto = new SearchEbooksDto();
    dto.mode = "invalid" as any;
    dto.query = "test";
    dto.pageNo = 1;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toEqual("mode");
  });

  it("ISBN 모드에서 유효하지 않은 ISBN일 경우 유효성 검사에 실패해야 한다", async () => {
    const dto = new SearchEbooksDto();
    dto.mode = "isbn";
    dto.query = "123";
    dto.pageNo = 1;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it("유효한 데이터일 경우 유효성 검사를 통과해야 한다", async () => {
    const dto = new SearchEbooksDto();
    dto.mode = "title";
    dto.query = "harry potter";
    dto.pageNo = 1;

    const errors = await validate(dto);
    expect(errors.length).toEqual(0);
  });
});
