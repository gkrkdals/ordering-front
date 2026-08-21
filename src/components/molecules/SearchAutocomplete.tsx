import {Autocomplete} from "@mui/material";
import {matchesSearch} from "@src/utils/hangul.ts";

interface SearchAutocompleteProps<T> {
  id?: string;
  options: T[];
  /** 목록·입력창에 표시할 이름 */
  getLabel: (option: T) => string;
  /** 목록에서 이름 옆에 함께 보여줄 부가 정보 (전화번호 등) */
  secondary?: (option: T) => string;
  value: T | null;
  onSelect: (option: T | null) => void;
  placeholder?: string;
  small?: boolean;
  disabled?: boolean;
}

/**
 * 초성 검색이 되는 자동완성 입력.
 *
 * 브라우저 기본 `<datalist>`는 필터링 규칙에 개입할 수 없어 초성 검색이 불가능하므로,
 * 검색이 필요한 선택 입력은 모두 이 컴포넌트를 사용한다.
 */
export default function SearchAutocomplete<T>(props: SearchAutocompleteProps<T>) {
  // 이름이 비어 있는 데이터가 섞여도 MUI가 깨지지 않도록 항상 문자열을 돌려준다
  const label = (option: T) => props.getLabel(option) ?? '';

  return (
    <Autocomplete
      id={props.id}
      options={props.options}
      value={props.value}
      disabled={props.disabled}
      onChange={(_, option) => props.onSelect(option)}
      getOptionLabel={label}
      isOptionEqualToValue={(option, value) => label(option) === label(value)}
      filterOptions={(options, state) =>
        options.filter(option => matchesSearch(label(option), state.inputValue))
      }
      noOptionsText='검색 결과 없음'
      openOnFocus
      selectOnFocus
      handleHomeEndKeys
      renderInput={params => (
        <div ref={params.InputProps.ref}>
          <input
            type='text'
            {...params.inputProps}
            className={`form-control ${props.small ? 'form-control-sm' : ''}`}
            placeholder={props.placeholder}
          />
        </div>
      )}
      renderOption={(optionProps, option, state) => (
        <li {...optionProps} key={state.index}>
          {label(option)}
          {
            props.secondary &&
            <span className='text-secondary ms-2' style={{ fontSize: '0.85em' }}>
              {props.secondary(option)}
            </span>
          }
        </li>
      )}
    />
  );
}
