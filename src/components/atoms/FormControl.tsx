import { ComponentPropsWithoutRef, CSSProperties, forwardRef, ReactNode } from "react";

interface FormControlProps extends ComponentPropsWithoutRef<'input'> {
  small?: boolean;
  suffix?: ReactNode;
  suffixStyle?: CSSProperties;
}

const FormControl = forwardRef<HTMLInputElement, FormControlProps>(
  ({ small, suffix, suffixStyle, className, style, ...props }, ref) => {
    const inputClass = `form-control ${small ? 'form-control-sm' : ''} ${className || ''}`.trim();

    if (suffix) {
      return (
        // Wrapper에 relative를 주어 기준점 설정
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', width: '100%' }}>
          <input
            ref={ref}
            type="text"
            className={inputClass}
            // 텍스트를 입력하다가 suffix 글자와 겹치지 않도록 우측 패딩 확보 (호출자가 덮어쓸 수 있음)
            style={{ paddingRight: '3rem', ...style }} 
            {...props}
          />
          {/* suffix를 absolute로 우측에 고정 */}
          <span style={{ position: 'absolute', right: '10px', color: '#6c757d', pointerEvents: 'none', fontSize: '1.3rem', ...suffixStyle }}>
            {suffix}
          </span>
        </div>
      );
    }

    return <input ref={ref} type="text" className={inputClass} style={style} {...props} />;
  }
);

FormControl.displayName = 'FormControl';

export default FormControl;