
      <PlanoFormStepper
        currentStep={step}
        totalSteps={totalSteps}
        onBack={prevStep}
        onNext={step === totalSteps ? form.handleSubmit(onSubmit) : nextStep}
        canAdvance={currentStepIsValid()}
        isLastStep={step === totalSteps}  // This is already a boolean
      />
