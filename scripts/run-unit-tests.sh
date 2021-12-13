set -e

echo "Running Unit Tests"

echo "> Cleaning testing output..."
rm -rf testing_output/* || true

echo "> Running tests..."
deno test --unstable --allow-read --coverage=testing_output/cov_profile "${TEST_FILE:-.}"

echo "> Generating coverage profile..."
deno coverage testing_output/cov_profile --lcov > testing_output/cov_profile.lcov

echo "> Generating coverage report..."
genhtml -o testing_output/cov_profile/html testing_output/cov_profile.lcov

echo "> DONE!"