// Props 타입 정의
import {ChangeEvent, ComponentPropsWithoutRef} from "react";

interface IName {
  name: string;
}

interface InputWithSuggestionsProps<T extends IName> extends ComponentPropsWithoutRef<"input"> {
  inputValue: string | undefined;
  filteredOptions: T[];
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onOptionClick: (option: T) => void;
  showSuggestions: boolean;
}

// SuggestionInput 컴포넌트
export default function InputWithSuggestions<T extends IName>(
  {inputValue, filteredOptions, onInputChange, onOptionClick, showSuggestions, ...props }: InputWithSuggestionsProps<T>
) {
  return (
    <div className="position-relative" style={{ width: '100%' }}>
      <input
        type="text"
        className="form-control"
        value={inputValue}
        onChange={onInputChange}
        placeholder="Type to search..."
        {...props}
      />
      {filteredOptions.length > 0 && showSuggestions && (
        <ul className="list-group position-absolute w-100" style={{ top: '100%', left: '0', zIndex: 1000 }}>
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              onClick={() => onOptionClick(option)}
              className="list-group-item list-group-item-action"
              style={{ cursor: 'pointer' }}
              onMouseOver={(e) => e.currentTarget.classList.add('bg-light')}
              onMouseOut={(e) => e.currentTarget.classList.remove('bg-light')}
            >
              {option.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};