export function classifyRunFailure(result, events) {
  if (result.exitCode === 0) return null;

  const diagnosticText = `${result.stderr}\n${result.stdout}`.toLowerCase();
  if (diagnosticText.includes('insufficient_quota') || diagnosticText.includes('quota exceeded')) {
    return 'provider_quota_exceeded';
  }
  if (diagnosticText.includes('invalid api key') || diagnosticText.includes('authentication')) {
    return 'provider_authentication_failed';
  }
  if (diagnosticText.includes('rate_limit') || diagnosticText.includes('rate limit') || diagnosticText.includes('429')) {
    return 'provider_rate_limited';
  }
  if (diagnosticText.includes('timeout') || diagnosticText.includes('timed out')) {
    return 'provider_timeout';
  }
  if (diagnosticText.includes('assertionerror') || diagnosticText.includes('failed tests')) {
    return 'evaluation_assertion_failed';
  }
  if (events.length === 0) return 'no_fixture_results';
  return 'evaluation_process_failed';
}
