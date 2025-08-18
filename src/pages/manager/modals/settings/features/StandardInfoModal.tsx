import BasicModalProps from "@src/interfaces/BasicModalProps.ts";
import {Dialog, DialogActions, DialogContent} from "@mui/material";
import React, {useEffect, useState} from "react";
import client from "@src/utils/network/client.ts";
import {Settings} from "@src/models/manager/settings.ts";
import {PrimaryButton, SecondaryButton} from "@src/components/atoms/Buttons.tsx";
import {BigColumn, Column, SmallColumn} from "@src/components/atoms/Columns.tsx";
import FormControl from "@src/components/atoms/FormControl.tsx";

interface StandardInfoModalProps extends BasicModalProps {}

export default function StandardInfoModal(props: StandardInfoModalProps) {

  const [settings, setSettings] = useState<Settings[]>([])
  const [logo, setLogo] = useState<File | null>(null);

  useEffect(() => {
    if(props.open) {
      client
        .get('/api/manager/settings/standard')
        .then(res => setSettings(res.data));
    }
  }, [props.open]);

  async function uploadFile() {
    if (logo) {
      const formData = new FormData();
      formData.append("logo", logo);
      await client.post("/api/manager/settings/logo", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>, sml: number) {
    if (sml === 1 && e.target.files) {
      setLogo(e.target.files[0]);
    } else {
      setSettings(settings.map(setting => {
        if (setting.sml === sml) {
          setting.stringValue = e.target.value;
        }
        return setting;
      }))
    }
  }

  async function handleSave() {
    await uploadFile();
    await client.put('/api/manager/settings/standard', settings);
    props.setOpen(false);
  }

  return (
    <Dialog open={props.open}>
      <DialogContent>
        {settings.map((setting, id) => (
          <Column key={id}>
            <SmallColumn>
              {setting.name}
            </SmallColumn>
            <BigColumn>
              <FormControl
                value={setting.sml === 1 ? undefined : setting.stringValue}
                type={setting.sml === 1 ? 'file' : 'text'}
                onChange={e => handleChange(e, setting.sml)}
              />
            </BigColumn>
          </Column>
        ))}
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={() => props.setOpen(false)}>
          닫기
        </SecondaryButton>
        <PrimaryButton onClick={handleSave}>
          저장
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  )
}