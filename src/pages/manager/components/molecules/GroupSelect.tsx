import {useContext} from "react";
import {DiscountGroupContext} from "@src/contexts/manager/DiscountGroupContext.tsx";
import Select from "@src/components/atoms/Select.tsx";

/** 전역(전체 공통) 설정을 가리키는 groupId. 백엔드 GLOBAL_GROUP_ID 와 같다 */
export const GLOBAL_GROUP_ID = 0;

interface GroupSelectProps {
  value: number;
  onChange: (groupId: number) => void;
  /** 그룹 전용 값이 아직 없어 전체 공통 값을 보여주는 중인지 */
  usingGlobal?: boolean;
}

/**
 * 설정 팝업 상단에 다는 고객 그룹 선택.
 *
 * 그룹을 고르면 그 그룹의 설정을 편집한다. 그룹 전용 값이 아직 없으면
 * 전체 공통 값이 보이고, 저장하는 순간 그룹 전용 설정이 만들어진다.
 */
export default function GroupSelect(props: GroupSelectProps) {
  const [discountGroups] = useContext(DiscountGroupContext)!;

  return (
    <div className='mb-3'>
      <p className='mb-1'>고객 그룹</p>
      <Select
        value={props.value}
        onChange={e => props.onChange(parseInt(e.target.value))}
      >
        <option value={GLOBAL_GROUP_ID}>전체 공통</option>
        {discountGroups.map((group, i) => (
          <option key={i} value={group.id}>{group.name}</option>
        ))}
      </Select>
      {
        props.value !== GLOBAL_GROUP_ID && props.usingGlobal &&
        <p className='text-secondary mt-1 mb-0' style={{ fontSize: '0.85em' }}>
          이 그룹만의 설정이 아직 없어 전체 공통 값을 보여주는 중입니다. 저장하면 이 그룹 전용 설정이 만들어집니다.
        </p>
      }
    </div>
  );
}
