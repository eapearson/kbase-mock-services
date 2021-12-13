set -e
rm -rf testing_output/* || true
deno test --unstable --allow-read  --coverage=testing_output/cov_profile "${TEST_FILE:-.}"
deno coverage testing_output/cov_profile --lcov > testing_output/cov_profile.lcov
genhtml -o testing_output/cov_profile/html testing_output/cov_profile.lcov