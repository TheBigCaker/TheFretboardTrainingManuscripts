import { checkout } from 'wix-pricing-plans-frontend';
import { getUserSubscriptionTier } from 'backend/subscriptionChecker';
import wixUsers from 'wix-users';

$w.onReady(async function () {
  await initializePricingPage();
});

async function initializePricingPage() {
  try {
    const subscriptionInfo = await getUserSubscriptionTier();
    
    updatePricingUI(subscriptionInfo);
    
    setupBuyButtons();
    
  } catch (error) {
    console.error('Error initializing pricing page:', error);
  }
}

function setupBuyButtons() {
  $w('#buyEducationBtn').onClick(() => handlePurchase('EDUCATION'));
  
  $w('#buyProBtn').onClick(() => handlePurchase('PRO'));
  
  if ($w('#freePlanBtn')) {
    $w('#freePlanBtn').onClick(() => {
      $w('#message').text = 'You are already on the Free plan!';
      $w('#message').show();
    });
  }
}

async function handlePurchase(planType) {
  try {
    if (!wixUsers.currentUser.loggedIn) {
      await wixUsers.promptLogin();
    }
    
    const planId = getPlanIdForType(planType);
    
    if (!planId) {
      showError(`${planType} plan is not configured yet`);
      return;
    }
    
    const order = await checkout.createOnlineOrder(planId);
    
    console.log('Order created:', order);
    
  } catch (error) {
    console.error('Purchase error:', error);
    showError('Unable to process purchase. Please try again.');
  }
}

function getPlanIdForType(planType) {
  switch (planType) {
    case 'EDUCATION':
      return 'YOUR_EDUCATION_PLAN_ID_HERE';
    case 'PRO':
      return 'YOUR_PRO_PLAN_ID_HERE';
    default:
      return null;
  }
}

function updatePricingUI(subscriptionInfo) {
  if (!subscriptionInfo.isLoggedIn) {
    if ($w('#loginPrompt')) {
      $w('#loginPrompt').show();
    }
    return;
  }
  
  if ($w('#loginPrompt')) {
    $w('#loginPrompt').hide();
  }
  
  if (subscriptionInfo.tier === 'education') {
    highlightCurrentPlan('#educationCard');
    disableButton('#buyEducationBtn', 'Current Plan');
  } else if (subscriptionInfo.tier === 'pro') {
    highlightCurrentPlan('#proCard');
    disableButton('#buyProBtn', 'Current Plan');
  } else {
    highlightCurrentPlan('#freeCard');
  }
}

function highlightCurrentPlan(cardId) {
  try {
    if ($w(cardId)) {
      $w(cardId).style.borderColor = '#4A90E2';
      $w(cardId).style.borderWidth = '3px';
    }
  } catch (e) {
    console.log('Card element not found:', cardId);
  }
}

function disableButton(buttonId, newText) {
  try {
    if ($w(buttonId)) {
      $w(buttonId).disable();
      $w(buttonId).label = newText;
    }
  } catch (e) {
    console.log('Button element not found:', buttonId);
  }
}

function showError(message) {
  if ($w('#errorMessage')) {
    $w('#errorMessage').text = message;
    $w('#errorMessage').show();
    
    setTimeout(() => {
      $w('#errorMessage').hide();
    }, 5000);
  } else {
    console.error(message);
  }
}
