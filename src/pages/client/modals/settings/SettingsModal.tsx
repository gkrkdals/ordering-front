import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {Dialog, DialogActions, DialogContent} from "@mui/material";
import {PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import Toggle from "@src/components/atoms/Toggle.tsx";
import { useEffect, useState} from "react";
import client from "@src/utils/network/client.ts";
import {useRecoilState} from "recoil";
import customerState from "@src/recoil/atoms/CustomerState.ts";
import Customer from "@src/models/common/Customer.ts";
import {Settings} from "@src/models/manager/settings.ts";
import StandardInfo from "@src/pages/client/modals/settings/StandardInfo.tsx";
import OrderHistory from "@src/pages/client/modals/OrderHistory.tsx";
import OrderHistoryCalendar from "@src/pages/client/modals/OrderHistoryCalendar.tsx";
import UsePointModal from "./UsePointModal";

/** 적립금 사용 오픈 여부. 오픈 시점이 확정되면 true로 바꾸면 됩니다. */
const POINT_USE_ENABLED = false;

interface SettingsModalProps extends BasicModalProps {}

export default function SettingsModal(props: SettingsModalProps) {
  const [customer, setCustomer] = useRecoilState(customerState);
  // const [recentMenus, setRecentMenus] = useState<RecentMenu[]>([]);
  const [settings, setSettings] = useState<Settings[]>([]);
  const [imgSource, setImgSource] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [openCalendar, setOpenCalendar] = useState(false);

  const [showPriceToggle, setShowPriceToggle] = useState(false);
  const [, setHideOrderStatus] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  const [openUsePoint, setOpenUsePoint] = useState(false);
  const [minUsePoint, setMinUsePoint] = useState<number>(3000);
  // 적립금 사용 후 잔금을 다시 읽기 위한 키
  const [creditRefreshKey, setCreditRefreshKey] = useState(0);

  async function toggleShowPrice() {
    const newValue = !showPriceToggle;
    if (customer) {
      await client.put('/api/settings/show-price', {
        customerId: customer.id,
        value: newValue ? 1 : 0
      });
      const newCustomerData: Customer = (await client.get('/api/auth/profile')).data;
      setCustomer(newCustomerData);
      setShowPriceToggle(newCustomerData.showPrice === 1);
    }
  }

  // 현재 사용하지 않음
  // async function toggleHideOrderStatus() {
  //   const newValue = !hideOrderStatus;
  //   if (customer) {
  //     await client.put('/api/settings/hide-order-status', {
  //       customerId: customer.id,
  //       value: newValue ? 1 : 0
  //     });
  //     const newCustomerData: Customer = (await client.get('/api/auth/profile')).data;
  //     setCustomer(newCustomerData);
  //     setHideOrderStatus(newCustomerData.hideOrderStatus === 1);
  //   }
  // }

  async function toggleShowConfirm() {
    const newValue = !showConfirm;
    if (customer) {
      await client.put('/api/settings/show-confirm', {
        customerId: customer.id,
        value: newValue ? 1 : 0
      });
      const newCustomerData: Customer = (await client.get('/api/auth/profile')).data;
      setCustomer(newCustomerData);
      setShowConfirm(newCustomerData.showConfirm === 1);
    }
  }

  useEffect(() => {
    client
      .get('/api/settings/logo', {
        responseType: 'blob'
      })
      .then(res => {
        const reader = new FileReader();
        reader.readAsDataURL(res.data);
        reader.onload = () => {
          setImgSource(reader.result as string);
        }
      });

    client
      .get('/api/settings/standard')
      .then(res => {
        setSettings(res.data);
      })
  }, []);

  useEffect(() => {
    if (customer) {
      setShowPriceToggle(customer.showPrice === 1);
      setHideOrderStatus(customer.hideOrderStatus === 1);
      setShowConfirm(customer.showConfirm === 1);
    }
  }, [customer]);

  useEffect(() => {
    if (props.open) {
      client
        .get("/api/settings/point-use-policy")
        .then((res) => setMinUsePoint(res.data.minUsePoint))
        .catch(() => setMinUsePoint(3000));
    }
  }, [props.open]);

  return (
    <>
      <Dialog open={props.open}>
        <DialogContent>
          <StandardInfo
            imgSource={imgSource}
            settings={settings}
            creditRefreshKey={creditRefreshKey}
          />
          {/*<button*/}
          {/*  style={{ fontSize: '1.2em' }}*/}
          {/*  className='w-100 btn btn-primary'*/}
          {/*  onClick={() => setOpen(true)}*/}
          {/*>*/}
          {/*  주문내역 보기*/}
          {/*</button>*/}
          <div className="d-flex gap-2">
            <button
              style={{ fontSize: '1.2em' }}
              className='w-100 btn btn-primary'
              onClick={() => setOpenCalendar(true)}
            >
              주문내역 보기
            </button>
            <PrimaryButton
              style={{ fontSize: '1.2em', width: '100%' }}
              onClick={() => setOpenUsePoint(true)}
              disabled={!POINT_USE_ENABLED || !customer || customer.pointBalance * 100 < minUsePoint}
            >
              적립금 사용
            </PrimaryButton>

          </div>
          <p className='mt-5 mb-1' style={{fontSize: '1.4em', fontWeight: 'bold'}}>
            일반설정
          </p>
          <div className='d-flex justify-content-between align-items-center'>
            <div>메뉴 금액 보기</div>
            <Toggle
              value={showPriceToggle}
              onChange={toggleShowPrice}
            />
          </div>
          {/* <div className='d-flex justify-content-between align-items-center'>
            <div>주문 진행상황 숨기기</div>
            <Toggle
              value={hideOrderStatus}
              onChange={toggleHideOrderStatus}
            />
          </div> */}
          <div className='d-flex justify-content-between align-items-center'>
            <div>주문 완료 전 확인하기</div>
            <Toggle
              value={showConfirm}
              onChange={toggleShowConfirm}
            />
          </div>

          <div style={{height: 50}}/>
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={() => props.setOpen(false)}>
            닫기
          </SecondaryButton>
        </DialogActions>
      </Dialog>
      <OrderHistoryCalendar
        open={openCalendar}
        setOpen={setOpenCalendar}
        selectedDates={selectedDates}
        setSelectedDates={setSelectedDates}
        setOpenHistory={setOpen}
      />
      <OrderHistory
        open={open}
        setOpen={setOpen}
        customer={customer}
        selectedDates={selectedDates}
        setSelectedDates={setSelectedDates}
      />
      <UsePointModal
        open={openUsePoint}
        setOpen={setOpenUsePoint}
        onUsed={() => setCreditRefreshKey(key => key + 1)}
      />
    </>
  )
}