export function trackPerformance(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = async function(...args: any[]) {
    const start = performance.now();
    const result = await originalMethod.apply(this, args);
    const duration = performance.now() - start;
    
    console.log(`Performance: ${propertyKey} took ${duration.toFixed(2)}ms`);
    return result;
  };
  
  return descriptor;
}