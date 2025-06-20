import React from 'react';
import Toggle from '../common/Toggle';

const PrivacySettings = ({ group, onUpdate, canModify, theme = 'blue' }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Privacy & Permissions</h3>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        <Toggle
          label="Private Group"
          description="Only invited members can join this group"
          checked={group.isPrivate}
          onChange={(e) => onUpdate('isPrivate', e.target.checked)}
          disabled={!canModify}
          color={theme}
        />

        <Toggle
          label="Allow Member Invites"
          description="Members can invite others to join"
          checked={group.allowMemberInvites}
          onChange={(e) => onUpdate('allowMemberInvites', e.target.checked)}
          disabled={!canModify}
          color={theme}
        />

        <Toggle
          label="Message History"
          description="New members can see previous messages"
          checked={group.messageHistory}
          onChange={(e) => onUpdate('messageHistory', e.target.checked)}
          disabled={!canModify}
          color={theme}
        />

        {!canModify && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div className="text-sm text-yellow-800">
                You don't have permission to modify these settings.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivacySettings;