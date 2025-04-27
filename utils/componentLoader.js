/**
 * Utility to load HTML components into the main document
 */
export async function loadComponent(filePath, targetElementId) {
    try {
      const response = await fetch(filePath);
      
      if (!response.ok) {
        throw new Error(`Failed to load component: ${filePath}`);
      }
      
      const htmlContent = await response.text();
      const targetElement = document.getElementById(targetElementId);
      
      if (!targetElement) {
        console.error(`Target element not found: ${targetElementId}`);
        return false;
      }
      
      targetElement.innerHTML = htmlContent;
      return true;
    } catch (error) {
      console.error('Error loading component:', error);
      return false;
    }
  }
  
  /**
   * Initialize all components
   */
  export async function initComponents() {
    const components = [
      { path: '/components/navigation.html', target: 'navigation-container' },
      { path: '/components/contact.html', target: 'modals-container' },
      { path: '/components/frieren.html', target: 'frieren-container' }
    ];
    
    const loadPromises = components.map(component => 
      loadComponent(component.path, component.target)
    );
    
    return Promise.all(loadPromises);
  }