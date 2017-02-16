#!/usr/bin/env bash

red=$(tput setaf 1)
green=$(tput setaf 2)
reset=$(tput sgr0)
success=0

# look up all directories containing terraform files
tf_dirs=$(find . -type f -name "*.tf" -print0 | xargs -0 -n1 dirname | sort -u)
echo "${reset}validating terraform files"
for tf_dir in $tf_dirs; do
    if terraform validate "$tf_dir" &>/dev/null; then
        echo -e "\t${reset}validated ${tf_dir} ${green}✓"
    else
        echo -e "\t${reset}validation failed for ${tf_dir} ${red}✗"
        terraform validate -no-color "$tf_dir"
        success=1
    fi
done

# reset foreground color. (may not work for all terminals)
tput sgr0

exit "$success"
