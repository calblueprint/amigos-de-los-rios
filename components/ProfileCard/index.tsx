"use client";

import { useState } from "react";
import {
  ErrorText,
  ProfileCardButton,
  ProfileCardButtonGroup,
  ProfileCardCancelButton,
  ProfileCardContainer,
  ProfileCardContent,
  ProfileCardHeader,
  ProfileCardSaveButton,
  ProfileCardTitle,
  ProfileField,
  ProfileFieldInput,
  ProfileFieldLabel,
  ProfileFieldValue,
} from "./styles";

interface ProfileFieldType {
  key?: string;
  label: string;
  value: string;
  validate?: (value: string) => string | null;
}

interface ProfileCardProps {
  title: string;
  fields: ProfileFieldType[];
  onSave?: (updatedFields: Record<string, string>) => void;
}

export default function ProfileCard({
  title,
  fields,
  onSave,
}: ProfileCardProps) {
  const [isEditable, setIsEditable] = useState(false);
  const [editedFields, setEditedFields] = useState(fields);
  const displayFields = isEditable ? editedFields : fields;
  const [initialData, setInitialData] = useState(fields);
  const [errors, setErrors] = useState<Record<number, string>>({});

  const handleEditClick = () => {
    setInitialData(fields);
    setEditedFields(fields);
    setErrors({});
    setIsEditable(true);
  };

  const handleCancelClick = () => {
    setEditedFields(initialData);
    setErrors({});
    setIsEditable(false);
  };

  const handleSaveClick = () => {
    // Validate fields before saving
    const newErrors: Record<number, string> = {};
    editedFields.forEach((field, i) => {
      if (field.validate) {
        const error = field.validate(field.value);
        if (error) newErrors[i] = error;
      }
    });
    // If there are validation errors, show them and don't save
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // Construct updated fields object to pass to onSave
    const updatedFields: Record<string, string> = {};
    editedFields.forEach((field, i) => {
      if (field.key && field.value !== initialData[i].value) {
        updatedFields[field.key] = field.value;
      }
    });
    // Call onSave only if there are changes to save
    if (onSave && Object.keys(updatedFields).length > 0) {
      onSave(updatedFields);
    }

    setIsEditable(false);
  };

  const handleFieldChange = (index: number, value: string) => {
    setEditedFields(
      editedFields.map((field, i) =>
        i === index ? { ...field, value } : field,
      ),
    );
    if (errors[index]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    }
  };

  return (
    <ProfileCardContainer>
      <ProfileCardHeader>
        <ProfileCardTitle>{title}</ProfileCardTitle>
        {isEditable ? (
          <ProfileCardButtonGroup>
            <ProfileCardCancelButton onClick={handleCancelClick}>
              Cancel
            </ProfileCardCancelButton>
            <ProfileCardSaveButton onClick={handleSaveClick}>
              Save Changes
            </ProfileCardSaveButton>
          </ProfileCardButtonGroup>
        ) : (
          <ProfileCardButton onClick={handleEditClick}>Edit</ProfileCardButton>
        )}
      </ProfileCardHeader>
      <ProfileCardContent>
        {displayFields.map((field, index) => (
          <ProfileField key={field.key ?? index}>
            <ProfileFieldLabel>{field.label}</ProfileFieldLabel>
            {isEditable ? (
              <>
                <ProfileFieldInput
                  value={field.value}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleFieldChange(index, e.target.value)
                  }
                />
                {errors[index] && <ErrorText>{errors[index]}</ErrorText>}
              </>
            ) : (
              <ProfileFieldValue>{field.value}</ProfileFieldValue>
            )}
          </ProfileField>
        ))}
      </ProfileCardContent>
    </ProfileCardContainer>
  );
}
