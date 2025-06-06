-- Create function to increment feedback votes
CREATE OR REPLACE FUNCTION increment_feedback_votes(p_feedback_id UUID, p_project_id UUID)
RETURNS TABLE (votes bigint)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  UPDATE feedback
  SET votes = votes + 1
  WHERE id = p_feedback_id
    AND project_id = p_project_id
  RETURNING votes;
END;
$$; 