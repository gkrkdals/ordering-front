import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {Dialog, DialogActions, DialogContent} from "@mui/material";
import {PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import {useEffect, useState} from "react";
import FormControl from "@src/components/atoms/FormControl.tsx";
import client from "@src/utils/client.ts";

interface ModifyExceedTimeProps extends BasicModalProps {}

export default function ModifyExceedTime(props: ModifyExceedTimeProps) {

  const [cookExceed, setCookExceed] = useState('');
  const [deliverDelay, setDeliverDelay] = useState('');

  useEffect(() => {
    if (props.open) {
      client
        .get('/api/manager/settings/exceed')
        .then(res => {
          setCookExceed(res.data[0].value)
          setDeliverDelay(res.data[1].value)
        })
    }
  }, [props.open]);

  async function handleSave() {
    await client.put('/api/manager/settings/exceed', {
      1: parseInt(cookExceed),
      2: parseInt(deliverDelay),
    });
    props.setOpen(false);
  }

  return (
    <Dialog open={props.open}>
      <DialogContent>
        <p className='mb-2'>조리시간 초과(분)</p>
        <FormControl
          type='number'
          placeholder='조리시간 초과(분)'
          value={cookExceed}
          onChange={e => setCookExceed(e.target.value)}
        />
        <p className='mb-2'>배달 지연(분)</p>
        <FormControl
          type='number'
          placeholder='배달 지연(분)'
          value={deliverDelay}
          onChange={e => setDeliverDelay(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
      <SecondaryButton onClick={() => props.setOpen(false)}>
          닫기
        </SecondaryButton>
        <PrimaryButton onClick={handleSave}>
          적용
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  )
}