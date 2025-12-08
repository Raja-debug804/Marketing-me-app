import React, { useState } from 'react';

const TenantOnboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    tenantName: '',
    adminEmail: '',
    shopifyDomain: '',
    ga4PropertyId: '',
  });

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  const handleSubmit = () => {
    // TODO: Submit onboarding data
    console.log('Submitting onboarding:', formData);
  };

  return (
    <div className="onboarding-container">
      <h1>Tenant Onboarding</h1>
      {step === 1 && (
        <div>
          <h2>Step 1: Basic Information</h2>
          <input
            type="text"
            placeholder="Tenant Name"
            value={formData.tenantName}
            onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
          />
          <input
            type="email"
            placeholder="Admin Email"
            value={formData.adminEmail}
            onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
          />
          <button onClick={handleNext}>Next</button>
        </div>
      )}
      {step === 2 && (
        <div>
          <h2>Step 2: Integrations</h2>
          <input
            type="text"
            placeholder="Shopify Domain"
            value={formData.shopifyDomain}
            onChange={(e) => setFormData({ ...formData, shopifyDomain: e.target.value })}
          />
          <input
            type="text"
            placeholder="GA4 Property ID"
            value={formData.ga4PropertyId}
            onChange={(e) => setFormData({ ...formData, ga4PropertyId: e.target.value })}
          />
          <button onClick={handlePrev}>Previous</button>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default TenantOnboarding;
