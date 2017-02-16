// setup iam user for circleci
resource "aws_iam_user_policy" "circleci-user-policy" {
  name   = "circleci-user-policy"
  policy = "${file("iam-policies/circleci-user-policy.json")}"
  user   = "${aws_iam_user.circleci-iam.name}"
}

resource "aws_iam_user" "circleci-iam" {
  name          = "circleci"
  force_destroy = false
}
