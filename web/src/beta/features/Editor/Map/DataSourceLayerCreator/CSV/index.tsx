import { FC, useCallback, useMemo, useState } from "react";

import URLField from "@reearth/beta/components/fields/URLField";
import {
  InputGroup,
  SubmitWrapper,
  Wrapper,
  InputsWrapper,
  ContentWrapper,
} from "@reearth/beta/features/Editor/Map/SharedComponent";
import { Button, Icon, RadioGroup, TextInput } from "@reearth/beta/lib/reearth-ui";
import { useT } from "@reearth/services/i18n";
import { styled, useTheme } from "@reearth/services/theme";

import { DataProps, SourceType, DataSourceOptType } from "..";
import { generateTitle } from "../util";

const CSV: FC<DataProps> = ({ sceneId, onSubmit, onClose }) => {
  const t = useT();
  const theme = useTheme();
  const [sourceType, setSourceType] = useState<SourceType>("local");
  const [value, setValue] = useState("");
  const [layerName, setLayerName] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const dataSourceOptions: DataSourceOptType = useMemo(
    () => [
      { label: t("From Assets"), value: "local" },
      { label: t("From Web"), value: "url" },
    ],
    [t],
  );

  const handleSubmit = () => {
    onSubmit({
      layerType: "simple",
      sceneId,
      title: generateTitle(value, layerName),
      visible: true,
      config: {
        data: {
          url: (sourceType === "url" || sourceType === "local") && value !== "" ? value : undefined,
          type: "csv",
          csv: {
            latColumn: lat,
            lngColumn: lng,
          },
        },
      },
    });
    onClose();
  };

  const handleValueChange = useCallback((value?: string, name?: string) => {
    setValue(value || "");
    setLayerName(name || "");
  }, []);

  const handleDataSourceTypeChange = useCallback((newValue: string) => {
    setSourceType(newValue as SourceType);
    setValue("");
  }, []);

  return (
    <Wrapper>
      <ContentWrapper>
        <InputGroup label={t("Source Type")}>
          <RadioGroup options={dataSourceOptions} onChange={handleDataSourceTypeChange} />
        </InputGroup>

        {sourceType == "local" && (
          //this Url field component will be replaced with new ui/fields
          <InputsWrapper>
            <URLField
              fileType="asset"
              entityType="file"
              name={t("Asset")}
              value={value}
              fileFormat="CSV"
              onChange={handleValueChange}
            />
          </InputsWrapper>
        )}
        {sourceType == "url" && (
          <InputGroup label={t("Resource URL")}>
            <InputsWrapper>
              <TextInput placeholder="https://" value={value} onChange={handleValueChange} />
            </InputsWrapper>
          </InputGroup>
        )}
        <Warning>
          <Icon icon="lightBulb" color={theme.warning.main} size="large" />
          <TextWrapper>
            {t(
              "Visualizer currently only supports CSV point data. Please specify the column names for latitude and longitude in your data below.",
            )}
          </TextWrapper>
        </Warning>
        <CoordinateWrapper>
          <InputGroup label={t("Latitude Column Name")}>
            <InputsWrapper>
              <TextInput
                value={lat}
                placeholder={t("Column Name")}
                onChange={value => setLat(value)}
              />
            </InputsWrapper>
          </InputGroup>
          <InputGroup label={t("Longitude Column Name")}>
            <InputsWrapper>
              <TextInput
                value={lng}
                placeholder={t("Column Name")}
                onChange={value => setLng(value)}
              />
            </InputsWrapper>
          </InputGroup>
        </CoordinateWrapper>
      </ContentWrapper>
      <SubmitWrapper>
        <Button
          title={t("Add to Layer")}
          disabled={!value || !lng || !lat}
          appearance="primary"
          onClick={handleSubmit}
        />
      </SubmitWrapper>
    </Wrapper>
  );
};

const Warning = styled("div")(({ theme }) => ({
  display: "flex",
  gap: theme.spacing.small,
  alignItems: "center",
}));

const TextWrapper = styled("div")(({ theme }) => ({
  color: theme.warning.main,
  fontSize: theme.fonts.sizes.body,
  fontWeight: theme.fonts.weight.regular,
}));

const CoordinateWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  gap: theme.spacing.small,
  alignItems: "center",
  width: "100%",
}));

export default CSV;
