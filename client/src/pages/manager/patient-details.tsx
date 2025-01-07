import React from 'react';
import { useParams } from 'react-router-dom';

export default function PatientDetails() {
  const { id } = useParams();
  return (
    <div>
      <h1>Patient Details - {id}</h1>
    </div>
  );
}