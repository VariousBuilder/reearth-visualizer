import { FC, useCallback, useEffect, useMemo, useState } from "react";

import { Button, DragAndDropList } from "@reearth/beta/lib/reearth-ui";
import { styled } from "@reearth/services/theme";

import CommonField, { CommonFieldProps } from "../CommonField";

import ListItem from "./ListItem";

const LIST_FIELD_DRAG_HANDLE_CLASS_NAME = "reearth-visualizer-editor-list-field-drag-handle";

export type ListItemProps = {
  id: string;
  title: string;
};

export type ListFieldProps = CommonFieldProps & {
  items: ListItemProps[];
  selected?: string;
  atLeastOneItem?: boolean;
  onItemAdd?: () => void;
  onItemSelect?: (id: string) => void;
  onItemDelete?: (id: string) => void;
  onItemMove?: (id: string, targetIndex: number) => void;
  onItemNameUpdate?: (id: string, value: string) => void;
};

const ListField: FC<ListFieldProps> = ({
  commonTitle,
  description,
  items,
  selected,
  atLeastOneItem,
  onItemAdd,
  onItemSelect,
  onItemDelete,
  onItemMove,
  onItemNameUpdate,
}) => {
  useEffect(() => {
    if (!atLeastOneItem) return;
    const updateSelected = !selected || !items.find(({ id }) => id === selected);
    if (updateSelected) {
      onItemSelect?.(items[0]?.id);
    }
  }, [selected, items, atLeastOneItem, onItemSelect]);
  const [isDragging, setIsDragging] = useState(false);

  const DraggableListItems = useMemo(
    () =>
      items.map(item => ({
        id: item.id,
        content: (
          <ListItem
            item={item}
            dragHandleClassName={LIST_FIELD_DRAG_HANDLE_CLASS_NAME}
            isDragging={isDragging}
            selectedItem={selected}
            onItemDelete={onItemDelete}
            onItemSelect={onItemSelect}
            onItemNameUpdate={onItemNameUpdate}
          />
        ),
      })),
    [items, isDragging, selected, onItemDelete, onItemSelect, onItemNameUpdate],
  );

  const handleMoveStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMoveEnd = useCallback(
    (itemId?: string, newIndex?: number) => {
      if (itemId !== undefined && newIndex !== undefined) {
        onItemMove?.(itemId, newIndex);
      }
      setIsDragging(false);
    },
    [onItemMove],
  );

  return (
    <CommonField commonTitle={commonTitle} description={description}>
      <FieldContainer>
        <Button
          onClick={onItemAdd}
          icon="plus"
          appearance="secondary"
          title="New Item"
          size="small"
          extendWidth
        />
        <FieldWrapper>
          <DragAndDropList
            items={DraggableListItems}
            handleClassName={LIST_FIELD_DRAG_HANDLE_CLASS_NAME}
            onMoveStart={handleMoveStart}
            onMoveEnd={handleMoveEnd}
          />
        </FieldWrapper>
      </FieldContainer>
    </CommonField>
  );
};

const FieldContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing.smallest,
}));

const FieldWrapper = styled("div")(({ theme }) => ({
  maxHeight: "136px",
  borderRadius: theme.radius.small,
  padding: theme.spacing.smallest,
  border: `1px solid ${theme.outline.weak}`,
  overflow: "auto",
}));

export default ListField;
