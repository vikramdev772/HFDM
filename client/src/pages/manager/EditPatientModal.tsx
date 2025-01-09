import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Fixed import path case
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  room: string;
  bed: string;
  floor: string;
  contact: string;
  emergency: string;
  diseases: string[];
  allergies: string[];
}

interface EditPatientModalProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
  onPatientUpdated: () => void;
}

export function EditPatientModal({ patient, isOpen, onClose, onPatientUpdated }: EditPatientModalProps) {
  const [editedPatient, setEditedPatient] = useState<Patient>(patient);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedPatient(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'diseases' | 'allergies') => {
    const values = e.target.value.split(',').map(item => item.trim());
    setEditedPatient(prev => ({ ...prev, [field]: values }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`https://hfdm.onrender.com/api/patients/${patient.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editedPatient)
      });

      if (!response.ok) {
        throw new Error('Failed to update patient');
      }

      toast({
        title: "Success",
        description: "Patient information updated successfully.",
      });
      onPatientUpdated();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update patient information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Patient Information</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={editedPatient.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="age">Age</Label>
            <Input
              type="number"
              id="age"
              name="age"
              value={editedPatient.age}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="gender">Gender</Label>
            <Input
              type="text"
              id="gender"
              name="gender"
              value={editedPatient.gender}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="room">Room</Label>
            <Input
              type="text"
              id="room"
              name="room"
              value={editedPatient.room}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="bed">Bed</Label>
            <Input
              type="text"
              id="bed"
              name="bed"
              value={editedPatient.bed}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="floor">Floor</Label>
            <Input
              type="text"
              id="floor"
              name="floor"
              value={editedPatient.floor}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="contact">Contact</Label>
            <Input
              type="text"
              id="contact"
              name="contact"
              value={editedPatient.contact}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="emergency">Emergency Contact</Label>
            <Input
              type="text"
              id="emergency"
              name="emergency"
              value={editedPatient.emergency}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="diseases">Diseases (comma-separated)</Label>
            <Input
              type="text"
              id="diseases"
              name="diseases"
              value={editedPatient.diseases.join(', ')}
              onChange={(e) => handleArrayInputChange(e, 'diseases')}
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="allergies">Allergies (comma-separated)</Label>
            <Input
              type="text"
              id="allergies"
              name="allergies"
              value={editedPatient.allergies.join(', ')}
              onChange={(e) => handleArrayInputChange(e, 'allergies')}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Patient'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

