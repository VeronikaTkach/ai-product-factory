# Evaluation Telemetry

## Signals

Track:

- task success
- user corrections
- turns to converge
- tool call count
- failed tool calls
- test failures
- self-repair attempts
- token cost
- wall-clock time
- final outcome

## Evaluation Uses

Telemetry supports:

- trajectory quality scoring
- self-repair behavior analysis
- cost and efficiency evaluation
- regression detection
- skill trigger analysis
- failure clustering

## Failure Clustering

Useful labels:

- wrong tool
- missing context
- bad requirement interpretation
- validation failure
- authorization failure
- test not run
- dependency issue
- UI mismatch
- cost runaway

## Cost Tracking

Track cost by:

- session
- model
- tool
- skill
- retry loop
- user correction count
