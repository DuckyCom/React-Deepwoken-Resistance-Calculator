"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Shield, Sword, Zap, X, ChevronLeft, ChevronRight, HelpCircle, Languages } from "lucide-react"

interface ArmorInputs {
  physicalEquip: number
  monsterArmorPips: number
  outfitPhysicalArmor: number
  steelScalesTalent: boolean
  outfitSlashArmor: number
  paddedArmorTalent: boolean
  outfitBluntArmor: number
  elementalEquip: number
  outfitElementalArmor: number
  attunementType: string
  outfitAttunementArmor: number
  innateAttunementStat: number
}

interface ArmorResults {
  physical: number
  slash: number
  blunt: number
  elemental: number
  attunement: number
}

interface TutorialStep {
  title: string
  content: string
  target?: string
  highlight?: boolean
}

type Language = "es" | "en"

export default function Component() {
  const [inputs, setInputs] = useState<ArmorInputs>({
    physicalEquip: 0,
    monsterArmorPips: 0,
    outfitPhysicalArmor: 0,
    steelScalesTalent: false,
    outfitSlashArmor: 0,
    paddedArmorTalent: false,
    outfitBluntArmor: 0,
    elementalEquip: 0,
    outfitElementalArmor: 0,
    attunementType: "Fire",
    outfitAttunementArmor: 0,
    innateAttunementStat: 0,
  })

  const [results, setResults] = useState<ArmorResults>({
    physical: 0,
    slash: 0,
    blunt: 0,
    elemental: 0,
    attunement: 0,
  })

  const [selectedExplanation, setSelectedExplanation] = useState<string>("Physical")
  const [showTutorial, setShowTutorial] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [language, setLanguage] = useState<Language>("en")

  // Translations
  const translations = {
    es: {
      title: "Calculadora de Armadura de Deepwoken",
      subtitle: "Calcula tus valores de resistencia para builds de armadura óptimos",
      armorConfig: "Configuración de Armadura",
      armorConfigDesc: "Ingresa los valores de tu equipamiento y talentos",
      calculatedResistances: "Resistencias Calculadas",
      calculatedResistancesDesc: "Tus valores finales de armadura basados en la configuración actual",
      monsterArmorPips: "Monster Armor Pips",
      monsterArmorPipsDesc: "Monster Armor Pips (se aplica tanto a Physical como Elemental)",
      physicalArmor: "Armadura Física",
      physicalArmorEquip: "Armadura Física (Equipamiento)",
      outfitPhysicalArmor: "Armadura Física del Outfit",
      slashBluntArmor: "Armadura Slash y Blunt",
      outfitSlashArmor: "Armadura Slash del Outfit",
      outfitBluntArmor: "Armadura Blunt del Outfit",
      steelScalesTalent: "Talento Steel Scales (+3 Armadura Slash)",
      paddedArmorTalent: "Talento Padded Armor (+3 Armadura Blunt)",
      elementalAttunement: "Elemental y Attunement",
      elementalArmorEquip: "Armadura Elemental (Equipamiento)",
      outfitElementalArmor: "Armadura Elemental del Outfit",
      attunementType: "Tipo de Attunement",
      outfitAttunementArmor: "Armadura de Attunement del Outfit",
      equipmentInnateAttunementStat: "Equipment Innate Attunement Stat",
      physicalArmorTotal: "Total Armadura Física",
      slashArmorTotal: "Total Armadura Slash",
      bluntArmorTotal: "Total Armadura Blunt",
      elementalArmorTotal: "Total Armadura Elemental",
      resistanceFormula: "Fórmula de Resistencia",
      howResistanceWorks: "Cómo funciona RESISTANCE(x, y)",
      resistanceCombines: "RESISTANCE(x, y) combina dos valores de armadura:",
      baseArmorValue: "x = Valor de armadura base",
      additionalArmor: "y = Armadura adicional a agregar",
      howItCalculates: "Cómo calcula:",
      step1: "1. Toma la armadura base (x)",
      step2: "2. Reduce la armadura adicional (y) basándose en cuánta armadura base ya tienes",
      step3: "3. Agrega la cantidad reducida a tu armadura base",
      selectArmorType: "Selecciona el tipo de armadura para ver tu cálculo:",
      physicalArmorCalc: "Armadura Física",
      slashArmorCalc: "Armadura Slash",
      bluntArmorCalc: "Armadura Blunt",
      elementalArmorCalc: "Armadura Elemental",
      attunementArmorCalc: "Armadura Attunement",
      welcome: "¡Bienvenido!",
      firstTime: "¿Es tu primera vez usando la calculadora de armadura de Deepwoken?",
      yesFirstTime: "Sí, es mi primera vez",
      alreadyKnow: "Ya la conozco",
      tutorial: "Tutorial",
      previous: "Anterior",
      next: "Siguiente",
      finish: "Finalizar",
      tutorialSteps: [
        {
          title: "¡Bienvenido a la Calculadora de Armadura de Deepwoken!",
          content:
            "Esta herramienta te ayuda a calcular todas tus resistencias de armadura. Te guiaré paso a paso para que entiendas cómo funciona.",
        },
        {
          title: "Monster Armor Pips",
          content: "🚧 En construcción - Esta sección está siendo actualizada con información más precisa.",
        },
        {
          title: "Physical Armor (Equipamiento)",
          content:
            "Esta es la armadura física que obtienes del equipamiento. No incluye los monster pips ni la armadura del outfit.",
        },
        {
          title: "Outfit Physical Armor",
          content:
            "La armadura física que te da tu outfit/ropa. Se combina con tu armadura base usando la fórmula de resistencia.",
        },
        {
          title: "Slash Armor",
          content:
            "La armadura contra ataques de corte de tu outfit. Si tienes el talento Steel Scales, agrega +3 puntos adicionales.",
        },
        {
          title: "Talentos de Armadura",
          content:
            "Steel Scales (+3 Slash) y Padded Armor (+3 Blunt) son talentos que mejoran tipos específicos de armadura. Márcalos si los tienes.",
        },
        {
          title: "Blunt Armor",
          content:
            "La armadura contra ataques contundentes de tu outfit. Si tienes Padded Armor, agrega +3 puntos adicionales.",
        },
        {
          title: "Elemental Armor (Equipamiento)",
          content:
            "La armadura elemental base de tu equipamiento. Al igual que la física, se combina con los monster pips.",
        },
        {
          title: "Outfit Elemental Armor",
          content: "La armadura elemental de tu outfit. Se combina con tu armadura elemental base.",
        },
        {
          title: "Attunement Type",
          content:
            "Tu tipo de sintonización (Fire, Ice, Wind, etc.). Esto determina qué tipo de armadura elemental específica calcular.",
        },
        {
          title: "Outfit Attunement Armor",
          content:
            "La armadura específica de tu sintonización que te da el outfit. Se combina con tu stat innato del equipamiento.",
        },
        {
          title: "Equipment Innate Attunement Stat",
          content:
            "Tu estadística innata en los equipamientos de la sintonización en específico. Mejora la efectividad de tu armadura de attunement.",
        },
        {
          title: "Resultados Calculados",
          content:
            "Aquí verás todos tus valores finales de resistencia. Los números se redondean hacia arriba y se actualizan en tiempo real.",
        },
        {
          title: "Explicaciones Detalladas",
          content:
            "En esta sección puedes ver cómo se calcula cada tipo de armadura con tus valores específicos. ¡Muy útil para entender el proceso!",
        },
        {
          title: "¡Listo para empezar!",
          content:
            "Ya conoces todas las funciones. Puedes volver a ver este tutorial en cualquier momento haciendo clic en el botón de ayuda. ¡Disfruta calculando tus resistencias!",
        },
      ],
    },
    en: {
      title: "Deepwoken Armor Calculator",
      subtitle: "Calculate your resistance values for optimal armor builds",
      armorConfig: "Armor Configuration",
      armorConfigDesc: "Enter your equipment and talent values",
      calculatedResistances: "Calculated Resistances",
      calculatedResistancesDesc: "Your final armor values based on current configuration",
      monsterArmorPips: "Monster Armor Pips",
      monsterArmorPipsDesc: "Monster Armor Pips (applies to both Physical & Elemental)",
      physicalArmor: "Physical Armor",
      physicalArmorEquip: "Physical Armor (Equipment)",
      outfitPhysicalArmor: "Outfit Physical Armor",
      slashBluntArmor: "Slash & Blunt Armor",
      outfitSlashArmor: "Outfit Slash Armor",
      outfitBluntArmor: "Outfit Blunt Armor",
      steelScalesTalent: "Steel Scales Talent (+3 Slash Armor)",
      paddedArmorTalent: "Padded Armor Talent (+3 Blunt Armor)",
      elementalAttunement: "Elemental & Attunement",
      elementalArmorEquip: "Elemental Armor (Equipment)",
      outfitElementalArmor: "Outfit Elemental Armor",
      attunementType: "Attunement Type",
      outfitAttunementArmor: "Outfit Attunement Armor",
      equipmentInnateAttunementStat: "Equipment Innate Attunement Stat",
      physicalArmorTotal: "Physical Armor Total",
      slashArmorTotal: "Slash Armor Total",
      bluntArmorTotal: "Blunt Armor Total",
      elementalArmorTotal: "Elemental Armor Total",
      resistanceFormula: "Resistance Formula",
      howResistanceWorks: "How RESISTANCE(x, y) works",
      resistanceCombines: "RESISTANCE(x, y) combines two armor values:",
      baseArmorValue: "x = Base armor value",
      additionalArmor: "y = Additional armor to add",
      howItCalculates: "How it calculates:",
      step1: "1. Takes the base armor (x)",
      step2: "2. Reduces the additional armor (y) based on how much base armor you already have",
      step3: "3. Adds the reduced amount to your base armor",
      selectArmorType: "Select armor type to see your calculation:",
      physicalArmorCalc: "Physical Armor",
      slashArmorCalc: "Slash Armor",
      bluntArmorCalc: "Blunt Armor",
      elementalArmorCalc: "Elemental Armor",
      attunementArmorCalc: "Attunement Armor",
      welcome: "Welcome!",
      firstTime: "Is this your first time using the Deepwoken armor calculator?",
      yesFirstTime: "Yes, it's my first time",
      alreadyKnow: "I already know it",
      tutorial: "Tutorial",
      previous: "Previous",
      next: "Next",
      finish: "Finish",
      tutorialSteps: [
        {
          title: "Welcome to the Deepwoken Armor Calculator!",
          content:
            "This tool helps you calculate all your armor resistances. I'll guide you step by step so you understand how it works.",
        },
        {
          title: "Monster Armor Pips",
          content: "🚧 Under construction - This section is being updated with more accurate information.",
        },
        {
          title: "Physical Armor (Equipment)",
          content:
            "This is the physical armor you get from equipment. It doesn't include monster pips or outfit armor.",
        },
        {
          title: "Outfit Physical Armor",
          content:
            "The physical armor your outfit/clothing gives you. It combines with your base armor using the resistance formula.",
        },
        {
          title: "Slash Armor",
          content:
            "The slash damage armor from your outfit. If you have the Steel Scales talent, it adds +3 additional points.",
        },
        {
          title: "Armor Talents",
          content:
            "Steel Scales (+3 Slash) and Padded Armor (+3 Blunt) are talents that improve specific armor types. Check them if you have them.",
        },
        {
          title: "Blunt Armor",
          content: "The blunt damage armor from your outfit. If you have Padded Armor, it adds +3 additional points.",
        },
        {
          title: "Elemental Armor (Equipment)",
          content: "The base elemental armor from your equipment. Like physical armor, it combines with monster pips.",
        },
        {
          title: "Outfit Elemental Armor",
          content: "The elemental armor from your outfit. It combines with your base elemental armor.",
        },
        {
          title: "Attunement Type",
          content:
            "Your attunement type (Fire, Ice, Wind, etc.). This determines which specific elemental armor type to calculate.",
        },
        {
          title: "Outfit Attunement Armor",
          content:
            "The specific attunement armor your outfit gives you. It combines with your innate stat from equipment.",
        },
        {
          title: "Equipment Innate Attunement Stat",
          content:
            "Your innate stat in equipment for the specific attunement. It improves the effectiveness of your attunement armor.",
        },
        {
          title: "Calculated Results",
          content: "Here you'll see all your final resistance values. Numbers are rounded up and update in real time.",
        },
        {
          title: "Detailed Explanations",
          content:
            "In this section you can see how each armor type is calculated with your specific values. Very useful for understanding the process!",
        },
        {
          title: "Ready to start!",
          content:
            "You now know all the functions. You can see this tutorial again anytime by clicking the help button. Enjoy calculating your resistances!",
        },
      ],
    },
  }

  const t = translations[language]
  const tutorialSteps = t.tutorialSteps

  // RESISTANCE function as specified
  const RESISTANCE = (x: number, y: number): number => {
    return x + (y - y * (x / 100))
  }

  // Load language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem("deepwoken-calculator-language") as Language
    if (savedLanguage && (savedLanguage === "es" || savedLanguage === "en")) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Check if user is new
  useEffect(() => {
    const hasVisited = localStorage.getItem("deepwoken-calculator-visited")
    if (!hasVisited) {
      setShowWelcome(true)
    }
  }, [])

  // Calculate all armor values
  useEffect(() => {
    // Physical Armor calculation
    const physicalBase = inputs.physicalEquip + inputs.monsterArmorPips
    const physical = RESISTANCE(physicalBase, inputs.outfitPhysicalArmor)

    // Slash Armor calculation
    const slashV = RESISTANCE(inputs.outfitSlashArmor, inputs.steelScalesTalent ? 3 : 0)
    const slash = RESISTANCE(physical, slashV)

    // Blunt Armor calculation
    const bluntV = RESISTANCE(inputs.outfitBluntArmor, inputs.paddedArmorTalent ? 3 : 0)
    const blunt = RESISTANCE(physical, bluntV)

    // Elemental Armor calculation
    const elementalBase = inputs.elementalEquip + inputs.monsterArmorPips
    const elemental = RESISTANCE(elementalBase, inputs.outfitElementalArmor)

    // Attunement Armor calculation
    const attunement = RESISTANCE(elemental, RESISTANCE(inputs.outfitAttunementArmor, inputs.innateAttunementStat))

    setResults({
      physical: Math.ceil(physical * 100) / 100,
      slash: Math.ceil(slash * 100) / 100,
      blunt: Math.ceil(blunt * 100) / 100,
      elemental: Math.ceil(elemental * 100) / 100,
      attunement: Math.ceil(attunement * 100) / 100,
    })
  }, [inputs])

  const updateInput = (field: keyof ArmorInputs, value: number | boolean | string) => {
    setInputs((prev) => ({ ...prev, [field]: value }))
  }

  const handleNumberInput = (field: keyof ArmorInputs, value: string) => {
    if (value === "") {
      updateInput(field, 0)
      return
    }
    const numValue = Number(value)
    if (!isNaN(numValue)) {
      updateInput(field, numValue)
    }
  }

  const getDisplayValue = (value: number): string => {
    return value === 0 ? "" : value.toString()
  }

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem("deepwoken-calculator-language", newLanguage)
  }

  const handleWelcomeResponse = (isNewUser: boolean) => {
    if (isNewUser) {
      setShowTutorial(true)
    } else {
      localStorage.setItem("deepwoken-calculator-visited", "true")
    }
    setShowWelcome(false)
  }

  const startTutorial = () => {
    setCurrentStep(0)
    setShowTutorial(true)
  }

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      closeTutorial()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const closeTutorial = () => {
    setShowTutorial(false)
    localStorage.setItem("deepwoken-calculator-visited", "true")
  }

  const getExplanationContent = (type: string) => {
    const physicalBase = inputs.physicalEquip + inputs.monsterArmorPips
    const elementalBase = inputs.elementalEquip + inputs.monsterArmorPips

    const examples = {
      Physical: {
        title: t.physicalArmorCalc,
        description: `Your equipment (${inputs.physicalEquip}) + monster pips (${inputs.monsterArmorPips}) = ${physicalBase}, then add outfit bonus (${inputs.outfitPhysicalArmor})`,
        result: `Final result: ${results.physical}`,
      },
      Slash: {
        title: t.slashArmorCalc,
        description: `Takes your outfit slash armor (${inputs.outfitSlashArmor})${inputs.steelScalesTalent ? ` + Steel Scales talent (+3)` : ""}, then combines with your Physical armor (${results.physical})`,
        result: `Final result: ${results.slash}`,
      },
      Blunt: {
        title: t.bluntArmorCalc,
        description: `Takes your outfit blunt armor (${inputs.outfitBluntArmor})${inputs.paddedArmorTalent ? ` + Padded Armor talent (+3)` : ""}, then combines with your Physical armor (${results.physical})`,
        result: `Final result: ${results.blunt}`,
      },
      Elemental: {
        title: t.elementalArmorCalc,
        description: `Your elemental equipment (${inputs.elementalEquip}) + monster pips (${inputs.monsterArmorPips}) = ${elementalBase}, then add outfit bonus (${inputs.outfitElementalArmor})`,
        result: `Final result: ${results.elemental}`,
      },
      Attunement: {
        title: `${inputs.attunementType} Armor`,
        description: `Takes your outfit ${inputs.attunementType.toLowerCase()} armor (${inputs.outfitAttunementArmor}) + innate stat (${inputs.innateAttunementStat}), then combines with your Elemental armor (${results.elemental})`,
        result: `Final result: ${results.attunement}`,
      },
    }
    return examples[type] || examples.Physical
  }

  const attunementTypes = ["Fire", "Ice", "Wind", "Ironsing", "Lightning", "Shadow", "Blood"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-2 sm:p-4">
      {/* Welcome Modal */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 max-w-md w-full">
            <div className="text-center">
              <HelpCircle className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-4">{t.welcome}</h2>
              <p className="text-slate-300 mb-6">{t.firstTime}</p>
              <div className="flex gap-3">
                <Button onClick={() => handleWelcomeResponse(true)} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  {t.yesFirstTime}
                </Button>
                <Button
                  onClick={() => handleWelcomeResponse(false)}
                  variant="outline"
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  {t.alreadyKnow}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tutorial Modal */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white">
                {t.tutorial} ({currentStep + 1}/{tutorialSteps.length})
              </h2>
              <Button onClick={closeTutorial} variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="mb-6">
              <h3 className="text-white font-medium mb-2">{tutorialSteps[currentStep].title}</h3>
              <p className="text-slate-300 text-sm">{tutorialSteps[currentStep].content}</p>
            </div>

            <div className="flex justify-between items-center">
              <Button
                onClick={prevStep}
                disabled={currentStep === 0}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                {t.previous}
              </Button>

              <div className="flex gap-1">
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${index === currentStep ? "bg-blue-400" : "bg-slate-600"}`}
                  />
                ))}
              </div>

              <Button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700" size="sm">
                {currentStep === tutorialSteps.length - 1 ? t.finish : t.next}
                {currentStep !== tutorialSteps.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-4 mb-2">
            <h1 className="text-2xl sm:text-4xl font-bold text-white">{t.title}</h1>
            <div className="flex gap-2">
              <Button
                onClick={startTutorial}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                title={t.tutorial}
              >
                <HelpCircle className="w-4 h-4" />
              </Button>
              <Select value={language} onValueChange={(value: Language) => changeLanguage(value)}>
                <SelectTrigger className="w-auto border-slate-600 text-slate-300 hover:bg-slate-700">
                  <Languages className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">🇪🇸 Español</SelectItem>
                  <SelectItem value="en">🇺🇸 English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="text-slate-300 text-sm sm:text-base">{t.subtitle}</p>
        </div>

        <div className="flex flex-col xl:grid xl:grid-cols-2 gap-4 sm:gap-6">
          {/* Input Form */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-2 text-lg sm:text-xl">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                {t.armorConfig}
              </CardTitle>
              <CardDescription className="text-slate-300 text-sm">{t.armorConfigDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {/* Monster Armor Section */}
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                  {t.monsterArmorPips}
                </h3>
                <div>
                  <Label htmlFor="monsterPips" className="text-slate-200 text-sm">
                    {t.monsterArmorPipsDesc}
                  </Label>
                  <Input
                    id="monsterPips"
                    type="number"
                    value={getDisplayValue(inputs.monsterArmorPips)}
                    onChange={(e) => handleNumberInput("monsterArmorPips", e.target.value)}
                    className={`bg-slate-700 border-slate-600 text-white mt-1 ${
                      showTutorial && tutorialSteps[currentStep]?.target === "monsterPips"
                        ? "ring-2 ring-blue-400 border-blue-400"
                        : ""
                    }`}
                    placeholder="0"
                  />
                </div>
              </div>

              <Separator className="bg-slate-600" />

              {/* Physical Armor Section */}
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                  <Sword className="w-3 h-3 sm:w-4 sm:h-4" />
                  {t.physicalArmor}
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="physicalEquip" className="text-slate-200 text-sm">
                      {t.physicalArmorEquip}
                    </Label>
                    <Input
                      id="physicalEquip"
                      type="number"
                      value={getDisplayValue(inputs.physicalEquip)}
                      onChange={(e) => handleNumberInput("physicalEquip", e.target.value)}
                      className={`bg-slate-700 border-slate-600 text-white mt-1 ${
                        showTutorial && tutorialSteps[currentStep]?.target === "physicalEquip"
                          ? "ring-2 ring-blue-400 border-blue-400"
                          : ""
                      }`}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="outfitPhysical" className="text-slate-200 text-sm">
                      {t.outfitPhysicalArmor}
                    </Label>
                    <Input
                      id="outfitPhysical"
                      type="number"
                      value={getDisplayValue(inputs.outfitPhysicalArmor)}
                      onChange={(e) => handleNumberInput("outfitPhysicalArmor", e.target.value)}
                      className={`bg-slate-700 border-slate-600 text-white mt-1 ${
                        showTutorial && tutorialSteps[currentStep]?.target === "outfitPhysical"
                          ? "ring-2 ring-blue-400 border-blue-400"
                          : ""
                      }`}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-slate-600" />

              {/* Slash & Blunt Section */}
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg font-semibold text-white">{t.slashBluntArmor}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="outfitSlash" className="text-slate-200 text-sm">
                      {t.outfitSlashArmor}
                    </Label>
                    <Input
                      id="outfitSlash"
                      type="number"
                      value={getDisplayValue(inputs.outfitSlashArmor)}
                      onChange={(e) => handleNumberInput("outfitSlashArmor", e.target.value)}
                      className={`bg-slate-700 border-slate-600 text-white mt-1 ${
                        showTutorial && tutorialSteps[currentStep]?.target === "outfitSlash"
                          ? "ring-2 ring-blue-400 border-blue-400"
                          : ""
                      }`}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="outfitBlunt" className="text-slate-200 text-sm">
                      {t.outfitBluntArmor}
                    </Label>
                    <Input
                      id="outfitBlunt"
                      type="number"
                      value={getDisplayValue(inputs.outfitBluntArmor)}
                      onChange={(e) => handleNumberInput("outfitBluntArmor", e.target.value)}
                      className={`bg-slate-700 border-slate-600 text-white mt-1 ${
                        showTutorial && tutorialSteps[currentStep]?.target === "outfitBlunt"
                          ? "ring-2 ring-blue-400 border-blue-400"
                          : ""
                      }`}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div
                    className={`flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600 ${
                      showTutorial && tutorialSteps[currentStep]?.target === "steelScales"
                        ? "ring-2 ring-blue-400 border-blue-400"
                        : ""
                    }`}
                  >
                    <Checkbox
                      id="steelScales"
                      checked={inputs.steelScalesTalent}
                      onCheckedChange={(checked) => updateInput("steelScalesTalent", checked as boolean)}
                      className="border-slate-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="steelScales" className="text-slate-200 font-medium cursor-pointer text-sm">
                      {t.steelScalesTalent}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600">
                    <Checkbox
                      id="paddedArmor"
                      checked={inputs.paddedArmorTalent}
                      onCheckedChange={(checked) => updateInput("paddedArmorTalent", checked as boolean)}
                      className="border-slate-400 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                    />
                    <Label htmlFor="paddedArmor" className="text-slate-200 font-medium cursor-pointer text-sm">
                      {t.paddedArmorTalent}
                    </Label>
                  </div>
                </div>
              </div>

              <Separator className="bg-slate-600" />

              {/* Elemental Section */}
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                  {t.elementalAttunement}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="elementalEquip" className="text-slate-200 text-sm">
                      {t.elementalArmorEquip}
                    </Label>
                    <Input
                      id="elementalEquip"
                      type="number"
                      value={getDisplayValue(inputs.elementalEquip)}
                      onChange={(e) => handleNumberInput("elementalEquip", e.target.value)}
                      className={`bg-slate-700 border-slate-600 text-white mt-1 ${
                        showTutorial && tutorialSteps[currentStep]?.target === "elementalEquip"
                          ? "ring-2 ring-blue-400 border-blue-400"
                          : ""
                      }`}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="outfitElemental" className="text-slate-200 text-sm">
                      {t.outfitElementalArmor}
                    </Label>
                    <Input
                      id="outfitElemental"
                      type="number"
                      value={getDisplayValue(inputs.outfitElementalArmor)}
                      onChange={(e) => handleNumberInput("outfitElementalArmor", e.target.value)}
                      className={`bg-slate-700 border-slate-600 text-white mt-1 ${
                        showTutorial && tutorialSteps[currentStep]?.target === "outfitElemental"
                          ? "ring-2 ring-blue-400 border-blue-400"
                          : ""
                      }`}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="attunementType" className="text-slate-200 text-sm">
                    {t.attunementType}
                  </Label>
                  <Select value={inputs.attunementType} onValueChange={(value) => updateInput("attunementType", value)}>
                    <SelectTrigger
                      className={`bg-slate-700 border-slate-600 text-white mt-1 ${
                        showTutorial && tutorialSteps[currentStep]?.target === "attunementType"
                          ? "ring-2 ring-blue-400 border-blue-400"
                          : ""
                      }`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {attunementTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="outfitAttunement" className="text-slate-200 text-sm">
                      {t.outfitAttunementArmor}
                    </Label>
                    <Input
                      id="outfitAttunement"
                      type="number"
                      value={getDisplayValue(inputs.outfitAttunementArmor)}
                      onChange={(e) => handleNumberInput("outfitAttunementArmor", e.target.value)}
                      className={`bg-slate-700 border-slate-600 text-white mt-1 ${
                        showTutorial && tutorialSteps[currentStep]?.target === "outfitAttunement"
                          ? "ring-2 ring-blue-400 border-blue-400"
                          : ""
                      }`}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="innateAttunement" className="text-slate-200 text-sm">
                      {t.equipmentInnateAttunementStat}
                    </Label>
                    <Input
                      id="innateAttunement"
                      type="number"
                      value={getDisplayValue(inputs.innateAttunementStat)}
                      onChange={(e) => handleNumberInput("innateAttunementStat", e.target.value)}
                      className={`bg-slate-700 border-slate-600 text-white mt-1 ${
                        showTutorial && tutorialSteps[currentStep]?.target === "innateAttunement"
                          ? "ring-2 ring-blue-400 border-blue-400"
                          : ""
                      }`}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Display */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-4">
              <CardTitle className="text-white text-lg sm:text-xl">{t.calculatedResistances}</CardTitle>
              <CardDescription className="text-slate-300 text-sm">{t.calculatedResistancesDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className={`grid gap-3 ${
                  showTutorial && tutorialSteps[currentStep]?.target === "results"
                    ? "ring-2 ring-blue-400 rounded-lg p-2"
                    : ""
                }`}
              >
                <div className="bg-slate-700/50 p-3 sm:p-4 rounded-lg border border-slate-600">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-200 font-medium text-sm sm:text-base">{t.physicalArmorTotal}</span>
                    <span className="text-xl sm:text-2xl font-bold text-blue-400">{results.physical}</span>
                  </div>
                </div>

                <div className="bg-slate-700/50 p-3 sm:p-4 rounded-lg border border-slate-600">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-200 font-medium text-sm sm:text-base">{t.slashArmorTotal}</span>
                    <span className="text-xl sm:text-2xl font-bold text-red-400">{results.slash}</span>
                  </div>
                </div>

                <div className="bg-slate-700/50 p-3 sm:p-4 rounded-lg border border-slate-600">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-200 font-medium text-sm sm:text-base">{t.bluntArmorTotal}</span>
                    <span className="text-xl sm:text-2xl font-bold text-orange-400">{results.blunt}</span>
                  </div>
                </div>

                <div className="bg-slate-700/50 p-3 sm:p-4 rounded-lg border border-slate-600">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-200 font-medium text-sm sm:text-base">{t.elementalArmorTotal}</span>
                    <span className="text-xl sm:text-2xl font-bold text-purple-400">{results.elemental}</span>
                  </div>
                </div>

                <div className="bg-slate-700/50 p-3 sm:p-4 rounded-lg border border-slate-600">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-200 font-medium text-sm sm:text-base">
                      {inputs.attunementType} Armor Total
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-green-400">{results.attunement}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                  <h4 className="text-white font-medium mb-2 text-sm sm:text-base">{t.resistanceFormula}</h4>
                  <p className="text-slate-300 text-xs sm:text-sm">RESISTANCE(x, y) = x + (y - (y × (x ÷ 100)))</p>
                </div>

                <div
                  className={`p-3 sm:p-4 bg-slate-700/30 rounded-lg border border-slate-600 ${
                    showTutorial && tutorialSteps[currentStep]?.target === "explanations"
                      ? "ring-2 ring-blue-400 border-blue-400"
                      : ""
                  }`}
                >
                  <h4 className="text-white font-medium mb-3 text-sm sm:text-base">{t.howResistanceWorks}</h4>
                  <div className="space-y-3">
                    <div className="bg-slate-600/30 p-3 rounded border border-slate-500">
                      <p className="text-slate-200 text-xs sm:text-sm mb-2">
                        <strong>{t.resistanceCombines}</strong>
                      </p>
                      <ul className="text-slate-300 text-xs sm:text-sm space-y-1 ml-4">
                        <li>
                          • <strong>{t.baseArmorValue}</strong>
                        </li>
                        <li>
                          • <strong>{t.additionalArmor}</strong>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-slate-600/30 p-3 rounded border border-slate-500">
                      <p className="text-slate-200 text-xs sm:text-sm mb-2">
                        <strong>{t.howItCalculates}</strong>
                      </p>
                      <div className="text-slate-300 text-xs sm:text-sm space-y-1">
                        <p>{t.step1}</p>
                        <p>{t.step2}</p>
                        <p>{t.step3}</p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="explanationType" className="text-slate-200 text-xs sm:text-sm">
                        {t.selectArmorType}
                      </Label>
                      <Select value={selectedExplanation} onValueChange={setSelectedExplanation}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-1 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Physical">{t.physicalArmorCalc}</SelectItem>
                          <SelectItem value="Slash">{t.slashArmorCalc}</SelectItem>
                          <SelectItem value="Blunt">{t.bluntArmorCalc}</SelectItem>
                          <SelectItem value="Elemental">{t.elementalArmorCalc}</SelectItem>
                          <SelectItem value="Attunement">{t.attunementArmorCalc}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {(() => {
                      const explanation = getExplanationContent(selectedExplanation)
                      return (
                        <div className="bg-blue-900/20 p-3 rounded border border-blue-700/50">
                          <h5 className="text-blue-200 font-medium text-sm mb-2">{explanation.title}</h5>
                          <p className="text-blue-100 text-xs sm:text-sm mb-1">{explanation.description}</p>
                          <p className="text-blue-100 text-xs sm:text-sm font-medium">{explanation.result}</p>
                        </div>
                      )
                    })()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
