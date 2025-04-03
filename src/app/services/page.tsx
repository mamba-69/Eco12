export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Our Services</h1>
      <p className="text-lg mb-8">
        We offer a wide range of eco-friendly services to help you manage e-waste responsibly.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-2">E-Waste Recycling</h2>
          <p>Professional handling and recycling of electronic waste with proper disposal methods.</p>
        </div>
        
        <div className="p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-2">Catalytic Converter Recycling</h2>
          <p>Extraction and recycling of precious metals like Platinum, Palladium, and Rhodium.</p>
        </div>
        
        <div className="p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-2">EPR Management</h2>
          <p>Extended Producer Responsibility services ensuring accountability throughout the product lifecycle.</p>
        </div>
        
        <div className="p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-2">Logistic Solution</h2>
          <p>Streamlined transportation and processing of e-waste across India with our own fleet.</p>
        </div>
      </div>
    </div>
  );
} 