import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "antd";

/**
 *
 * @param {Promise} onClick
 */

const AsynButton = ({ onClick, ...rest }) => {
  const [loading, setLoading] = useState(false);

  const onClickAction = () => {
    setLoading(true);
    onClick().finally(() => setLoading(false));
  };

  return <Button {...rest} loading={loading} onClick={onClickAction} />;
};

AsynButton.propTypes = {
  onClick: PropTypes.instanceOf(Function)
};

export default AsynButton;
