"use client"

import { useState } from "react"
import { SportSelection } from "@/components/onboarding/sport-selection"
import { RoleSelection } from "@/components/onboarding/role-selection"
import { SituationSelection } from "@/components/onboarding/situation-selection"
import { useRouter } from "next/navigation"

export default function OnboardingPage() {
  const [step, setStep] = useState<"sport" | "role" | "situation">("sport")
  const [selectedSport, setSelectedSport] = useState<string>("")
  const [selectedRole, setSelectedRole] = useState<string>("")
  const router = useRouter()

  const handleSportSelect = (sport: string) => {
    setSelectedSport(sport)
    setStep("role")
  }

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role)
    setStep("situation")
  }

  const handleSituationSelect = (situation: string) => {
    localStorage.setItem(
      "athleteProfile",
      JSON.stringify({
        sport: selectedSport,
        role: selectedRole,
        situation: situation,
        onboardingComplete: true,
      }),
    )
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {step === "sport" ? (
        <SportSelection onSelect={handleSportSelect} />
      ) : step === "role" ? (
        <RoleSelection onSelect={handleRoleSelect} onBack={() => setStep("sport")} />
      ) : (
        <SituationSelection sport={selectedSport} onSelect={handleSituationSelect} onBack={() => setStep("role")} />
      )}
    </div>
  )
}
