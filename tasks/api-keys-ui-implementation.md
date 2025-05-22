# API Keys UI Implementation Tasks

## Overview

This document outlines the tasks required to implement the UI components for API key management in the FeedVote platform. These components will allow users to view, create, update, delete, and regenerate API keys for their projects.

## UI Components

### 1. API Keys Tab/Section in Project Settings

- [ ] Add "API Keys" tab/section to the project settings sidebar
- [ ] Create the main API Keys page layout
- [ ] Add heading and description explaining API keys

### 2. API Keys List Component

- [ ] Create a table/list component to display API keys
- [ ] Include columns: Name, Type, Created date, Last used, Status, Actions
- [ ] Add loading state for when keys are being fetched
- [ ] Add empty state for when no keys exist
- [ ] Add error state for when keys fail to load
- [ ] Implement pagination if needed

### 3. API Key Item Component

- [ ] Create a component to display a single API key
- [ ] Show key details: name, description, type, created date, last used
- [ ] Add visual indicators for key status (active/inactive, expired)
- [ ] Include actions: copy key, regenerate, edit, delete
- [ ] Implement copy-to-clipboard functionality for key values
- [ ] Add confirmation modal for regenerate action
- [ ] Add confirmation modal for delete action

### 4. Create API Key Component

- [ ] Create a form/modal for creating new API keys
- [ ] Include fields: key type, name, description, expiration
- [ ] Add form validation
- [ ] Implement error handling
- [ ] Show success state with the newly created key
- [ ] Add special UI for displaying the key value (only shown once)

### 5. Edit API Key Component

- [ ] Create a form/modal for editing API keys
- [ ] Include editable fields: name, description, active status, expiration
- [ ] Add form validation
- [ ] Implement error handling
- [ ] Show success state after update

### 6. API Key Widget Integration Component

- [ ] Create a component to display code snippets for widget integration
- [ ] Include tabs for different platforms (JavaScript, React, Flutter, etc.)
- [ ] Implement syntax highlighting for code snippets
- [ ] Add copy-to-clipboard functionality for code snippets
- [ ] Update snippets based on selected API key

## Data Management

### 1. API Client Functions

- [ ] Implement `listApiKeys(projectId)` function
- [ ] Implement `createApiKey(data)` function
- [ ] Implement `getApiKey(id)` function
- [ ] Implement `updateApiKey(id, data)` function
- [ ] Implement `deleteApiKey(id)` function
- [ ] Implement `regenerateApiKey(id)` function

### 2. State Management

- [ ] Create state management for API keys list
- [ ] Implement loading states
- [ ] Implement error handling
- [ ] Implement optimistic updates for better UX

## Integration

### 1. Navigation and Routing

- [ ] Add route for API Keys page: `/app/[projectId]/settings/api-keys`
- [ ] Update navigation component to include API Keys section
- [ ] Implement proper route transitions

### 2. Widget Integration Updates

- [ ] Update widget configuration to include API key parameter
- [ ] Update widget documentation to explain API key usage
- [ ] Add API key selection to widget embed page

## Testing

- [ ] Test API key creation
- [ ] Test API key listing
- [ ] Test API key editing
- [ ] Test API key deletion
- [ ] Test API key regeneration
- [ ] Test widget integration with API keys
- [ ] Test error states and edge cases
- [ ] Test responsive design

## Documentation

- [ ] Add user-facing documentation explaining API keys
- [ ] Create tooltips for key management interface
- [ ] Add instructions for secure API key usage

## Implementation Order

1. **Phase 1: Basic Management**
   - API Keys tab/section in project settings
   - API Keys list component
   - Create API Key component
2. **Phase 2: Detailed Interactions**
   - API Key item component with detailed actions
   - Edit API Key component
   - Delete and regenerate functionality
3. **Phase 3: Widget Integration**
   - API Key widget integration component
   - Update widget to use API keys
   - Comprehensive documentation

## Estimated Effort

- Phase 1: 1-2 days
- Phase 2: 1-2 days
- Phase 3: 1 day
- Testing and polishing: 1 day

Total: 4-6 days
