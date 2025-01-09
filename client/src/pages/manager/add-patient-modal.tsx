'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from 'lucide-react'

interface AddPatientModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPatientAdded: () => void
}

export function AddPatientModal({ open, onOpenChange, onPatientAdded }: AddPatientModalProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const patientData = {
      name: formData.get('name'),
      roomNumber: formData.get('roomNumber'),
      bedNumber: formData.get('bedNumber'),
      floorNumber: formData.get('floorNumber'),
      age: parseInt(formData.get('age') as string),
      gender: formData.get('gender'),
      diseases: formData.get('diseases')?.toString().split(',').map(d => d.trim()) || [],
      allergies: formData.get('allergies')?.toString().split(',').map(a => a.trim()) || [],
      contactInfo: formData.get('contactInfo'),
      emergencyContact: formData.get('emergencyContact'),
    }

    try {
      const response = await fetch('https://hfdm.onrender.com/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(patientData)
      })

      if (!response.ok) {
        throw new Error('Failed to add patient')
      }

      toast({
        title: "Success",
        description: "Patient has been added successfully.",
      })
      onOpenChange(false)
      onPatientAdded()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add patient. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
          <DialogDescription>
            Enter the patient's details below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="roomNumber">Room Number</Label>
              <Input id="roomNumber" name="roomNumber" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bedNumber">Bed Number</Label>
              <Input id="bedNumber" name="bedNumber" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="floorNumber">Floor Number</Label>
              <Input id="floorNumber" name="floorNumber" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" name="age" type="number" required />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="gender">Gender</Label>
            <Input id="gender" name="gender" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="diseases">Diseases (comma-separated)</Label>
            <Input id="diseases" name="diseases" placeholder="Diabetes, Hypertension" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="allergies">Allergies (comma-separated)</Label>
            <Input id="allergies" name="allergies" placeholder="Peanuts, Shellfish" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contactInfo">Contact Information</Label>
            <Input id="contactInfo" name="contactInfo" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="emergencyContact">Emergency Contact</Label>
            <Input id="emergencyContact" name="emergencyContact" required />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Patient'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

